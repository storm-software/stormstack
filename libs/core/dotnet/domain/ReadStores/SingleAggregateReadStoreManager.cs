using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ReadStores
{
    public class SingleAggregateReadStoreManager<TAggregate, TIdentity, TReadModelStore, TReadModel>
        : ReadStoreManager<TReadModelStore, TReadModel>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
        where TReadModelStore : IReadModelStore<TReadModel>
        where TReadModel : class, IReadModel
    {
        private readonly IEventStore _eventStore;

        public SingleAggregateReadStoreManager(
            ILogger<
                SingleAggregateReadStoreManager<TAggregate, TIdentity, TReadModelStore, TReadModel>
            > logger,
            IServiceProvider serviceProvider,
            TReadModelStore readModelStore,
            IReadModelDomainEventApplier readModelDomainEventApplier,
            IReadModelFactory<TReadModel> readModelFactory,
            IEventStore eventStore
        )
            : base(
                logger,
                serviceProvider,
                readModelStore,
                readModelDomainEventApplier,
                readModelFactory
            )
        {
            _eventStore = eventStore;
        }

        protected override IReadOnlyCollection<ReadModelUpdate> BuildReadModelUpdates(
            IReadOnlyCollection<IDomainEvent> domainEvents
        )
        {
            return domainEvents
                .GroupBy(d => d.GetIdentity().Value)
                .Select(
                    g =>
                        new ReadModelUpdate(
                            g.Key,
                            g.OrderBy(d => d.AggregateSequenceNumber).ToList()
                        )
                )
                .ToList()
                .AsReadOnly();
        }

        private async Task<TReadModel> GetOrCreateReadModel(
            ReadModelEnvelope<TReadModel> readModelEnvelope,
            CancellationToken cancellationToken
        )
        {
            return readModelEnvelope.ReadModel
                ?? await ReadModelFactory
                    .CreateAsync(readModelEnvelope.ReadModelId, cancellationToken)
                    .ConfigureAwait(false);
        }

        private async Task<ReadModelUpdateResult<TReadModel>> ApplyUpdatesAsync(
            IReadModelContext readModelContext,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            ReadModelEnvelope<TReadModel> readModelEnvelope,
            CancellationToken cancellationToken
        )
        {
            TReadModel readModel = await GetOrCreateReadModel(readModelEnvelope, cancellationToken);

            await ReadModelDomainEventApplier
                .UpdateReadModelAsync(readModel, domainEvents, readModelContext, cancellationToken)
                .ConfigureAwait(false);

            var readModelVersion = Math.Max(
                domainEvents.Max(e => e.AggregateSequenceNumber),
                readModelEnvelope.Version.GetValueOrDefault()
            );

            return readModelEnvelope.AsModifiedResult(readModel, readModelVersion);
        }

        protected override async Task<ReadModelUpdateResult<TReadModel>> UpdateAsync(
            IReadModelContext readModelContext,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            ReadModelEnvelope<TReadModel> readModelEnvelope,
            CancellationToken cancellationToken
        )
        {
            if (!domainEvents.Any())
                throw new ArgumentException("No domain events");

            var expectedVersion = domainEvents.Min(d => d.AggregateSequenceNumber) - 1;
            var envelopeVersion = readModelEnvelope.Version;

            IReadOnlyCollection<IDomainEvent> eventsToApply;

            if (envelopeVersion.HasValue && expectedVersion != envelopeVersion)
            {
                var version = envelopeVersion.Value;
                if (expectedVersion < version)
                {
                    if (Logger.IsEnabled(LogLevel.Trace))
                    {
                        Logger.LogTrace(
                            "Read model {ReadModelType} with ID {Id} already has version {Version} compared to {ExpectedVersion}, skipping",
                            typeof(TReadModel),
                            readModelEnvelope.ReadModelId,
                            version,
                            expectedVersion
                        );
                    }

                    return readModelEnvelope.AsUnmodifiedResult<TReadModel>();
                }

                // Apply missing events
                var identity = domainEvents
                    .Cast<IDomainEvent<TAggregate, TIdentity>>()
                    .First()
                    .AggregateIdentity;
                eventsToApply = await _eventStore
                    .LoadEventsAsync<TAggregate, TIdentity>(
                        identity,
                        version + 1,
                        cancellationToken
                    )
                    .ConfigureAwait(false);

                if (Logger.IsEnabled(LogLevel.Trace))
                {
                    Logger.LogTrace(
                        "Read model {ReadModelType} with ID {Id} is missing some events {Version} < {ExpectedVersion}, adding them (got {MissingEventCount} events)",
                        typeof(TReadModel).PrettyPrint(),
                        readModelEnvelope.ReadModelId,
                        version,
                        expectedVersion,
                        eventsToApply.Count
                    );
                }
            }
            else
            {
                eventsToApply = domainEvents;
                if (Logger.IsEnabled(LogLevel.Trace))
                {
                    Logger.LogTrace(
                        "Read model {ReadModelType} with ID {Id} has version {ExpectedVersion} (or none), applying events",
                        typeof(TReadModel).PrettyPrint(),
                        readModelEnvelope.ReadModelId,
                        expectedVersion
                    );
                }
            }

            return await ApplyUpdatesAsync(
                    readModelContext,
                    eventsToApply,
                    readModelEnvelope,
                    cancellationToken
                )
                .ConfigureAwait(false);
        }
    }
}
