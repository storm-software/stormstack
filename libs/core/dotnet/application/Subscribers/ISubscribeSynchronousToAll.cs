using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Subscribers
{
    public interface ISubscribeSynchronousToAll
    {
        Task HandleAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );
    }
}
