using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public interface IEventUpgrader
    {
        IAsyncEnumerable<IDomainEvent> UpgradeAsync(
            IDomainEvent domainEvent,
            IEventUpgradeContext eventUpgradeContext,
            CancellationToken cancellationToken
        );
    }

    public interface IEventUpgrader<TAggregate, TIdentity> : IEventUpgrader
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
    {
        IAsyncEnumerable<IDomainEvent<TAggregate, TIdentity>> UpgradeAsync(
            IDomainEvent<TAggregate, TIdentity> domainEvent,
            IEventUpgradeContext eventUpgradeContext,
            CancellationToken cancellationToken
        );
    }
}
