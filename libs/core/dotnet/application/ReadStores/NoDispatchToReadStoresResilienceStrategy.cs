using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.ReadStores
{
    public class NoDispatchToReadStoresResilienceStrategy : IDispatchToReadStoresResilienceStrategy
    {
        public Task BeforeUpdateAsync(
            IReadStoreManager readStoreManager,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            return Task.CompletedTask;
        }

        public Task<bool> HandleUpdateFailedAsync(
            IReadStoreManager readStoreManager,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            Exception exception,
            CancellationToken cancellationToken
        )
        {
            return Task.FromResult(false);
        }

        public Task UpdateSucceededAsync(
            IReadStoreManager readStoreManager,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            return Task.CompletedTask;
        }
    }
}
