using System.Collections;
using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Infrastructure.EventPersistence.InMemory
{
    public class InMemoryEventPersistence : IEventPersistence, IDisposable
    {
        private readonly ILogger<InMemoryEventPersistence> _logger;

        private readonly ConcurrentDictionary<string, ImmutableEventCollection> _eventStore =
            new ConcurrentDictionary<string, ImmutableEventCollection>();

        private readonly AsyncLock _asyncLock = new AsyncLock();

        private class InMemoryCommittedDomainEvent : ICommittedDomainEvent
        {
            public int GlobalSequenceNumber { get; set; }

            public string AggregateId { get; set; }

            public string AggregateName { private get; set; }

            public string Data { get; set; }

            public string Metadata { get; set; }

            public ulong AggregateSequenceNumber { get; set; }

            public override string ToString()
            {
                return new StringBuilder()
                    .AppendLineFormat(
                        "{0} v{1} ==================================",
                        AggregateName,
                        AggregateSequenceNumber
                    )
                    .AppendLine(PrettifyJson(Metadata))
                    .AppendLine("---------------------------------")
                    .AppendLine(PrettifyJson(Data))
                    .Append("---------------------------------")
                    .ToString();
            }

            private static string PrettifyJson(string json)
            {
                try
                {
                    var obj = JsonSerializer.Deserialize<object>(json);
                    var prettyJson = JsonSerializer.Serialize(
                        obj,
                        new JsonSerializerOptions { WriteIndented = true }
                    );

                    return prettyJson;
                }
                catch (Exception)
                {
                    return json;
                }
            }
        }

        private class ImmutableEventCollection : IReadOnlyCollection<InMemoryCommittedDomainEvent>
        {
            private readonly List<InMemoryCommittedDomainEvent> _events;

            public ImmutableEventCollection(List<InMemoryCommittedDomainEvent> events)
            {
                _events = events;
            }

            public int Count => _events.Count;

            public InMemoryCommittedDomainEvent Last => _events.Last();

            public ImmutableEventCollection Add(List<InMemoryCommittedDomainEvent> events)
            {
                return new ImmutableEventCollection(_events.Concat(events).ToList());
            }

            public IEnumerator<InMemoryCommittedDomainEvent> GetEnumerator()
            {
                return _events.GetEnumerator();
            }

            IEnumerator IEnumerable.GetEnumerator()
            {
                return GetEnumerator();
            }
        }

        public InMemoryEventPersistence(ILogger<InMemoryEventPersistence> logger)
        {
            _logger = logger;
        }

        public Task<AllCommittedEventsPage> LoadAllCommittedEvents(
            GlobalPosition globalPosition,
            int pageSize,
            CancellationToken cancellationToken
        )
        {
            var startPosition = globalPosition.IsStart ? 0 : int.Parse(globalPosition.Value);

            var committedDomainEvents = _eventStore
                .SelectMany(kv => kv.Value)
                .Where(e => e.GlobalSequenceNumber >= startPosition)
                .OrderBy(e => e.GlobalSequenceNumber)
                .Take(pageSize)
                .ToList();

            var nextPosition = committedDomainEvents.Any()
                ? committedDomainEvents.Max(e => e.GlobalSequenceNumber) + 1
                : startPosition;

            return Task.FromResult(
                new AllCommittedEventsPage(
                    new GlobalPosition(nextPosition.ToString()),
                    committedDomainEvents
                )
            );
        }

        public async Task<IReadOnlyCollection<ICommittedDomainEvent>> CommitEventsAsync(
            IIdentity id,
            IReadOnlyCollection<SerializedEvent> serializedEvents,
            CancellationToken cancellationToken
        )
        {
            if (!serializedEvents.Any())
                return new List<ICommittedDomainEvent>();

            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                var globalCount = _eventStore.Values.Sum(events => events.Count);

                var newCommittedDomainEvents = serializedEvents
                    .Select(
                        (e, i) =>
                        {
                            var committedDomainEvent = new InMemoryCommittedDomainEvent
                            {
                                AggregateId = id.Value,
                                AggregateName = e.Metadata[MetadataKeys.AggregateName],
                                AggregateSequenceNumber = e.AggregateSequenceNumber,
                                Data = e.SerializedData,
                                Metadata = e.SerializedMetadata,
                                GlobalSequenceNumber = globalCount + i + 1,
                            };
                            _logger.LogTrace(
                                "Committing event {CommittedEvent}",
                                committedDomainEvent
                            );
                            return committedDomainEvent;
                        }
                    )
                    .ToList();

                var expectedVersion = newCommittedDomainEvents.First().AggregateSequenceNumber - 1;
                var lastEvent = newCommittedDomainEvents.Last();

                var updateResult = _eventStore.AddOrUpdate(
                    id.Value,
                    s => new ImmutableEventCollection(newCommittedDomainEvents),
                    (s, collection) =>
                        ulong.CreateChecked(collection.Count) == expectedVersion
                            ? collection.Add(newCommittedDomainEvents)
                            : collection
                );
                if (updateResult.Last != lastEvent)
                    throw new OptimisticConcurrencyException(string.Empty);

                return newCommittedDomainEvents;
            }
        }

        public Task<IReadOnlyCollection<ICommittedDomainEvent>> LoadCommittedEventsAsync(
            IIdentity id,
            ulong fromEventSequenceNumber,
            CancellationToken cancellationToken
        )
        {
            IReadOnlyCollection<ICommittedDomainEvent> result;

            if (_eventStore.TryGetValue(id.Value, out var committedDomainEvent))
                result =
                    fromEventSequenceNumber <= 1
                        ? (IReadOnlyCollection<ICommittedDomainEvent>)committedDomainEvent
                        : committedDomainEvent
                            .Where(e => e.AggregateSequenceNumber >= fromEventSequenceNumber)
                            .ToList();
            else
                result = new List<InMemoryCommittedDomainEvent>();

            return Task.FromResult(result);
        }

        public Task DeleteEventsAsync(IIdentity id, CancellationToken cancellationToken)
        {
            var deleted = _eventStore.TryRemove(id.Value, out var committedDomainEvents);

            if (deleted)
            {
                _logger.LogTrace(
                    "Deleted entity with ID {Id} by deleting all of its {EventCount} events",
                    id,
                    committedDomainEvents.Count
                );
            }

            return Task.FromResult(0);
        }

        public void Dispose()
        {
            _asyncLock.Dispose();
        }
    }
}
