using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Subscribers
{
    public class NoDispatchToSubscriberResilienceStrategy : IDispatchToSubscriberResilienceStrategy
    {
        public Task BeforeHandleEventAsync(
            ISubscribe subscriberTo,
            IDomainEvent domainEvent,
            CancellationToken cancellationToken
        )
        {
            return Task.CompletedTask;
        }

        public Task HandleEventFailedAsync(
            ISubscribe subscriberTo,
            IDomainEvent domainEvent,
            Exception exception,
            bool swallowException,
            CancellationToken cancellationToken
        )
        {
            return Task.CompletedTask;
        }

        public Task HandleEventSucceededAsync(
            ISubscribe subscriberTo,
            IDomainEvent domainEvent,
            CancellationToken cancellationToken
        )
        {
            return Task.CompletedTask;
        }

        public Task BeforeDispatchToSubscribersAsync(
            IDomainEvent domainEvent,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            return Task.CompletedTask;
        }

        public Task DispatchToSubscribersSucceededAsync(
            IDomainEvent domainEvent,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            return Task.CompletedTask;
        }

        public Task<bool> HandleDispatchToSubscribersFailedAsync(
            IDomainEvent domainEvent,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            Exception exception,
            CancellationToken cancellationToken
        )
        {
            return Task.FromResult(false);
        }
    }
}
