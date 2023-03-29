using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.ReadStores
{
    public interface IDispatchToReadStores
    {
        Task DispatchAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );
    }
}
