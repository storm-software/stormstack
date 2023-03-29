using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public interface IEventUpgradeManager
    {
        IAsyncEnumerable<IDomainEvent> UpgradeAsync(
            IAsyncEnumerable<IDomainEvent> domainEvents,
            IEventUpgradeContext eventUpgradeContext,
            CancellationToken cancellationToken
        );

        IAsyncEnumerable<IDomainEvent<TAggregate, TIdentity>> UpgradeAsync<TAggregate, TIdentity>(
            IAsyncEnumerable<IDomainEvent<TAggregate, TIdentity>> domainEvents,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;
    }
}
