using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Subscribers
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
