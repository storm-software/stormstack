using OpenSystem.Core.Application.Subscribers;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Publishers
{
    public interface IDispatchToSubscriberResilienceStrategy
    {
        Task BeforeHandleEventAsync(
            ISubscribe subscriberTo,
            IDomainEvent domainEvent,
            CancellationToken cancellationToken
        );

        Task HandleEventFailedAsync(
            ISubscribe subscriberTo,
            IDomainEvent domainEvent,
            Exception exception,
            bool swallowException,
            CancellationToken cancellationToken
        );

        Task HandleEventSucceededAsync(
            ISubscribe subscriberTo,
            IDomainEvent domainEvent,
            CancellationToken cancellationToken
        );

        Task BeforeDispatchToSubscribersAsync(
            IDomainEvent domainEvent,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );

        Task DispatchToSubscribersSucceededAsync(
            IDomainEvent domainEvent,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );

        Task<bool> HandleDispatchToSubscribersFailedAsync(
            IDomainEvent domainEvent,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            Exception exception,
            CancellationToken cancellationToken
        );
    }
}
