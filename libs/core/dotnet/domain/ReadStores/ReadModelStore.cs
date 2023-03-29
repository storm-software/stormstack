using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ReadStores
{
    public abstract class ReadModelStore<TReadModel> : IReadModelStore<TReadModel>
        where TReadModel : class, IReadModel
    {
        protected ILogger Logger { get; }

        protected ReadModelStore(ILogger logger)
        {
            Logger = logger;
        }

        public abstract Task<ReadModelEnvelope<TReadModel>> GetAsync(
            string id,
            CancellationToken cancellationToken
        );

        public abstract Task DeleteAsync(string id, CancellationToken cancellationToken);

        public abstract Task DeleteAllAsync(CancellationToken cancellationToken);

        public abstract Task UpdateAsync(
            IReadOnlyCollection<ReadModelUpdate> readModelUpdates,
            IReadModelContextFactory readModelContextFactory,
            Func<
                IReadModelContext,
                IReadOnlyCollection<IDomainEvent>,
                ReadModelEnvelope<TReadModel>,
                CancellationToken,
                Task<ReadModelUpdateResult<TReadModel>>
            > updateReadModel,
            CancellationToken cancellationToken
        );
    }
}
