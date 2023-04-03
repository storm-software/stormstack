using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.ReadStores
{
    public interface IDispatchToReadStoresResilienceStrategy
    {
        Task BeforeUpdateAsync(
            IReadStoreManager readStoreManager,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );

        Task<bool> HandleUpdateFailedAsync(
            IReadStoreManager readStoreManager,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            Exception exception,
            CancellationToken cancellationToken
        );

        Task UpdateSucceededAsync(
            IReadStoreManager readStoreManager,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );
    }
}
