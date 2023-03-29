using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ReadStores
{
    public class MultipleAggregateReadStoreManager<TReadStore, TReadModel, TReadModelLocator>
        : ReadStoreManager<TReadStore, TReadModel>
        where TReadStore : IReadModelStore<TReadModel>
        where TReadModel : class, IReadModel
        where TReadModelLocator : IReadModelLocator
    {
        private readonly TReadModelLocator _readModelLocator;

        public MultipleAggregateReadStoreManager(
            ILogger<
                MultipleAggregateReadStoreManager<TReadStore, TReadModel, TReadModelLocator>
            > logger,
            IServiceProvider serviceProvider,
            TReadStore readModelStore,
            IReadModelDomainEventApplier readModelDomainEventApplier,
            TReadModelLocator readModelLocator,
            IReadModelFactory<TReadModel> readModelFactory
        )
            : base(
                logger,
                serviceProvider,
                readModelStore,
                readModelDomainEventApplier,
                (ReadModelFactory<TReadModel>)readModelFactory
            )
        {
            _readModelLocator = readModelLocator;
        }

        protected override IReadOnlyCollection<ReadModelUpdate> BuildReadModelUpdates(
            IReadOnlyCollection<IDomainEvent> domainEvents
        )
        {
            var readModelUpdates = (
                from de in domainEvents
                let readModelIds = _readModelLocator.GetReadModelIds(de)
                from rid in readModelIds
                group de by rid into g
                select new ReadModelUpdate(
                    g.Key,
                    g.OrderBy(d => d.Timestamp).ThenBy(d => d.AggregateSequenceNumber).ToList()
                )
            ).ToList();
            return readModelUpdates;
        }

        protected override async Task<ReadModelUpdateResult<TReadModel>> UpdateAsync(
            IReadModelContext readModelContext,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            ReadModelEnvelope<TReadModel> readModelEnvelope,
            CancellationToken cancellationToken
        )
        {
            var readModel = readModelEnvelope.ReadModel;
            if (readModel == null)
            {
                readModel = await ReadModelFactory
                    .CreateAsync(readModelEnvelope.ReadModelId, cancellationToken)
                    .ConfigureAwait(false);
            }

            await ReadModelDomainEventApplier
                .UpdateReadModelAsync(readModel, domainEvents, readModelContext, cancellationToken)
                .ConfigureAwait(false);

            return readModelEnvelope.AsModifiedResult(
                readModel,
                readModelEnvelope.Version.GetValueOrDefault() + 1 // the best we can do
            );
        }
    }
}
