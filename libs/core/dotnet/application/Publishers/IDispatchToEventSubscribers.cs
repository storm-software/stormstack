using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Publishers
{
    public interface IDispatchToEventSubscribers
    {
        Task DispatchToSynchronousSubscribersAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );

        Task DispatchToAsynchronousSubscribersAsync(
            IDomainEvent domainEvent,
            CancellationToken cancellationToken
        );
    }
}
