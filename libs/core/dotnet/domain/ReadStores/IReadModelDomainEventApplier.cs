using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.ReadStores
{
    public interface IReadModelDomainEventApplier
    {
        Task<bool> UpdateReadModelAsync<TReadModel>(
            TReadModel readModel,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            IReadModelContext readModelContext,
            CancellationToken cancellationToken
        )
            where TReadModel : IReadModel;
    }
}
