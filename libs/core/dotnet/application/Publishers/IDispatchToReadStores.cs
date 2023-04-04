using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Publishers
{
    public interface IDispatchToReadStores
    {
        Task DispatchAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );
    }
}
