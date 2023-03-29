using System.Data.Entity.Core;
using System.Text;
using EventStore.ClientAPI;
using EventStore.ClientAPI.Exceptions;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Infrastructure.EventStore.Repositories
{
    public class EventStoreEventPersistence : IEventPersistence
    {
        private readonly ILogger<EventStoreEventPersistence> _logger;

        private readonly IEventStoreConnection _connection;

        private class EventStoreEvent : ICommittedDomainEvent
        {
            public string AggregateId { get; set; }

            public string Data { get; set; }

            public string Metadata { get; set; }

            public uint AggregateSequenceNumber { get; set; }
        }

        public EventStoreEventPersistence(
            ILogger<EventStoreEventPersistence> logger,
            IEventStoreConnection connection
        )
        {
            _logger = logger;
            _connection = connection;
        }

        public async Task<AllCommittedEventsPage> LoadAllCommittedEvents(
            GlobalPosition globalPosition,
            int pageSize,
            CancellationToken cancellationToken
        )
        {
            var nextPosition = ParsePosition(globalPosition);
            var resolvedEvents = new List<ResolvedEvent>();
            AllEventsSlice allEventsSlice;

            do
            {
                allEventsSlice = await _connection
                    .ReadAllEventsForwardAsync(nextPosition, pageSize, false)
                    .ConfigureAwait(false);
                resolvedEvents.AddRange(
                    allEventsSlice.Events.Where(e => !e.OriginalStreamId.StartsWith("$"))
                );
                nextPosition = allEventsSlice.NextPosition;
            } while (resolvedEvents.Count < pageSize && !allEventsSlice.IsEndOfStream);

            var eventStoreEvents = Map(resolvedEvents);

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
            {
                return Position.Start;
            }

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

            return new Position(commitPosition, preparePosition);
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

            var expectedVersion = Math.Max(
                serializedEvents.Min(e => e.AggregateSequenceNumber) - 2,
                ExpectedVersion.NoStream
            );
            var eventData = serializedEvents
                .Select(e =>
                {
                    // While it might be tempting to use e.Metadata.EventId here, we can't
                    // as EventStore won't detect optimistic concurrency exceptions then
                    var guid = Guid.NewGuid();

                    var eventType = string.Format(
                        "{0}.{1}.{2}",
                        e.Metadata[MetadataKeys.AggregateName],
                        e.Metadata.EventName,
                        e.Metadata.EventVersion
                    );
                    var data = Encoding.UTF8.GetBytes(e.SerializedData);
                    var meta = Encoding.UTF8.GetBytes(e.SerializedMetadata);
                    return new EventData(guid, eventType, true, data, meta);
                })
                .ToList();

            try
            {
                var writeResult = await _connection
                    .AppendToStreamAsync(id.Value, expectedVersion, eventData)
                    .ConfigureAwait(false);

                _logger.LogInformation(
                    "Wrote entity {0} with version {1} ({2},{3})",
                    id,
                    writeResult.NextExpectedVersion - 1,
                    writeResult.LogPosition.CommitPosition,
                    writeResult.LogPosition.PreparePosition
                );
            }
            catch (WrongExpectedVersionException e)
            {
                throw new OptimisticConcurrencyException(e.Message, e);
            }

            return committedDomainEvents;
        }

        public async Task<IReadOnlyCollection<ICommittedDomainEvent>> LoadCommittedEventsAsync(
            IIdentity id,
            int fromEventSequenceNumber,
            CancellationToken cancellationToken
        )
        {
            var streamEvents = new List<ResolvedEvent>();

            StreamEventsSlice currentSlice;
            var nextSliceStart =
                fromEventSequenceNumber <= 1 ? StreamPosition.Start : fromEventSequenceNumber - 1; // Starts from zero

            do
            {
                currentSlice = await _connection
                    .ReadStreamEventsForwardAsync(id.Value, nextSliceStart, 200, false)
                    .ConfigureAwait(false);
                nextSliceStart = (int)currentSlice.NextEventNumber;
                streamEvents.AddRange(currentSlice.Events);
            } while (!currentSlice.IsEndOfStream);

            return Map(streamEvents);
        }

        public Task DeleteEventsAsync(IIdentity id, CancellationToken cancellationToken)
        {
            return _connection.DeleteStreamAsync(id.Value, ExpectedVersion.Any);
        }

        private static IReadOnlyCollection<EventStoreEvent> Map(
            IEnumerable<ResolvedEvent> resolvedEvents
        )
        {
            return resolvedEvents
                .Select(
                    e =>
                        new EventStoreEvent
                        {
                            AggregateSequenceNumber = (uint)(e.Event.EventNumber + 1), // Starts from zero
                            Metadata = Encoding.UTF8.GetString(e.Event.Metadata),
                            AggregateId = e.OriginalStreamId,
                            Data = Encoding.UTF8.GetString(e.Event.Data),
                        }
                )
                .ToList();
        }
    }
}
