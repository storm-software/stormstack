using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Application.ReadStores
{
    public interface IReadModelStore
    {
        Task DeleteAsync(string id, CancellationToken cancellationToken);

        Task DeleteAllAsync(CancellationToken cancellationToken);
    }

    public interface IReadModelStore<TReadModel> : IReadModelStore
        where TReadModel : class, IReadModel
    {
        Task<ReadModelEnvelope<TReadModel>> GetAsync(
            string id,
            CancellationToken cancellationToken
        );

        Task UpdateAsync(
            IReadOnlyCollection<ReadModelUpdate> readModelUpdates,
            IReadModelContextFactory readModelContextFactory,
            Func<
                IReadModelContext,
                IReadOnlyCollection<IDomainEvent>,
                ReadModelEnvelope<TReadModel>,
                CancellationToken,
                Task<ReadModelEnvelope<TReadModel>>
            > updateReadModel,
            CancellationToken cancellationToken
        );
    }
}
