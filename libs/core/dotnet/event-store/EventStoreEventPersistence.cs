using System.Text;
using EventStore.Client;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.EventStore.Settings;
using static EventStore.Client.EventStoreClient;

namespace OpenSystem.Core.EventStore
{
    public class EventStoreEventPersistence : IEventPersistence
    {
        private readonly ILogger<EventStoreEventPersistence> _logger;

        private readonly EventStoreClient _eventStoreClient;

        private readonly IEventStoreSettings _eventStoreSettings = new EventStoreSettings();

        private class EventStoreEvent : ICommittedDomainEvent
        {
            public string AggregateId { get; set; }

            public string Data { get; set; }

            public string Metadata { get; set; }

            public ulong AggregateSequenceNumber { get; set; }
        }

        public EventStoreEventPersistence(
            ILogger<EventStoreEventPersistence> logger,
            EventStoreClient eventStoreClient,
            IEventStoreSettings eventStoreSettings
        )
        {
            _logger = logger;
            _eventStoreClient = eventStoreClient;

            if (_eventStoreSettings != null)
                _eventStoreSettings = eventStoreSettings;
        }

        public async Task<AllCommittedEventsPage> LoadAllCommittedEvents(
            GlobalPosition globalPosition,
            int pageSize,
            CancellationToken cancellationToken
        )
        {
            var nextPosition = ParsePosition(globalPosition);
            var resolvedEvents = new List<ResolvedEvent>();
            ReadAllStreamResult allEventsSlice;

            allEventsSlice = _eventStoreClient.ReadAllAsync(
                Direction.Forwards,
                nextPosition,
                pageSize,
                false
            );

            var eventStoreEvents = await MapAll(allEventsSlice);
            return new AllCommittedEventsPage(
                new GlobalPosition(
                    string.Format(
                        "{0}-{1}",
                        nextPosition.CommitPosition,
                        nextPosition.PreparePosition
                    )
                ),
                eventStoreEvents
            );
        }

        private static Position ParsePosition(GlobalPosition globalPosition)
        {
            if (globalPosition.IsStart)
                return Position.Start;

            var parts = globalPosition.Value.Split('-');
            if (parts.Length != 2)
            {
                throw new ArgumentException(
                    string.Format(
                        "Unknown structure for global position '{0}'. Expected it to be empty or in the form 'L-L'",
                        globalPosition.Value
                    )
                );
            }

            var commitPosition = long.Parse(parts[0]);
            var preparePosition = long.Parse(parts[1]);

            return new Position((ulong)commitPosition, (ulong)preparePosition);
        }

        public async Task<IReadOnlyCollection<ICommittedDomainEvent>> CommitEventsAsync(
            IIdentity id,
            IReadOnlyCollection<SerializedEvent> serializedEvents,
            CancellationToken cancellationToken
        )
        {
            var committedDomainEvents = serializedEvents
                .Select(
                    e =>
                        new EventStoreEvent
                        {
                            AggregateSequenceNumber = e.AggregateSequenceNumber,
                            Metadata = e.SerializedMetadata,
                            AggregateId = id.Value,
                            Data = e.SerializedData
                        }
                )
                .ToList();

            var eventData = serializedEvents
                .Select(e =>
                {
                    return new EventData(
                        Uuid.NewUuid(),
                        $"{e.Metadata[MetadataKeys.AggregateName]}.{e.Metadata.EventName}.{e.Metadata.EventVersion}",
                        Encoding.UTF8.GetBytes(e.SerializedData),
                        Encoding.UTF8.GetBytes(e.SerializedMetadata)
                    );
                })
                .ToList();

            try
            {
                var writeResult = await _eventStoreClient
                    .AppendToStreamAsync(
                        id.Value,
                        serializedEvents.Min(e => e.AggregateSequenceNumber) - 2,
                        eventData
                    )
                    .ConfigureAwait(false);

                _logger.LogInformation(
                    "Wrote entity {0} with version {1} ({2},{3})",
                    id,
                    writeResult.NextExpectedStreamRevision,
                    writeResult.LogPosition.CommitPosition,
                    writeResult.LogPosition.PreparePosition
                );
            }
            catch (WrongExpectedVersionException e)
            {
                throw new Domain.Exceptions.OptimisticConcurrencyException(e.Message, e);
            }

            return committedDomainEvents;
        }

        public async Task<IReadOnlyCollection<ICommittedDomainEvent>> LoadCommittedEventsAsync(
            IIdentity id,
            ulong fromEventSequenceNumber,
            CancellationToken cancellationToken
        )
        {
            var pendingStreams = new List<ReadStreamResult>();
            long nextSliceStart = new StreamPosition(fromEventSequenceNumber).ToInt64();
            var queryMaxCount = long.CreateChecked(_eventStoreSettings.QueryMaxCount);
            do
            {
                var pendingStream = _eventStoreClient.ReadStreamAsync(
                    Direction.Backwards,
                    id.Value,
                    ulong.CreateChecked(nextSliceStart),
                    _eventStoreSettings.QueryMaxCount,
                    false,
                    _eventStoreSettings.QueryDeadline
                );
                if (await pendingStream.ReadState == ReadState.StreamNotFound)
                    return new List<ICommittedDomainEvent>();

                pendingStreams.Add(pendingStream);
                nextSliceStart -= queryMaxCount;
            } while (nextSliceStart >= 0 && nextSliceStart >= StreamPosition.Start.ToInt64());

            return (
                await Task.WhenAll(pendingStreams.Select(p => Map(p))).ConfigureAwait(false)
            ).Aggregate((a, b) => a.Concat(b).ToList());
        }

        public Task DeleteEventsAsync(IIdentity id, CancellationToken cancellationToken)
        {
            return _eventStoreClient.DeleteAsync(id.Value, StreamState.Any);
        }

        private async Task<IReadOnlyCollection<ICommittedDomainEvent>> Map(
            ReadStreamResult streamResult
        )
        {
            return await streamResult
                .Select(
                    e =>
                        new EventStoreEvent()
                        {
                            AggregateSequenceNumber = e.Event.EventNumber.ToUInt64() + 1,
                            Metadata = Encoding.UTF8.GetString(e.Event.Metadata.Span),
                            AggregateId = e.OriginalStreamId,
                            Data = Encoding.UTF8.GetString(e.Event.Data.Span),
                        }
                )
                .ToListAsync()
                .ConfigureAwait(false);
        }

        private async Task<IReadOnlyCollection<ICommittedDomainEvent>> MapAll(
            ReadAllStreamResult streamResult
        )
        {
            return await streamResult
                .Where(e => !e.Event.EventType.StartsWith("$"))
                .Select(
                    e =>
                        new EventStoreEvent()
                        {
                            AggregateSequenceNumber = e.Event.EventNumber.ToUInt64() + 1,
                            Metadata = Encoding.UTF8.GetString(e.Event.Metadata.Span),
                            AggregateId = e.OriginalStreamId,
                            Data = Encoding.UTF8.GetString(e.Event.Data.Span),
                        }
                )
                .ToListAsync()
                .ConfigureAwait(false);
        }
    }
}
