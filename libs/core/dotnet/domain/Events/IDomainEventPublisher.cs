using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public interface IDomainEventPublisher
    {
        Task PublishAsync<TAggregate, TIdentity>(
            TIdentity id,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;

        Task PublishAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );
    }
}
