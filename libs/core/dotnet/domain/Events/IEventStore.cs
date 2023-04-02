using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Events
{
    public interface IEventStore
    {
        Task<IReadOnlyCollection<IDomainEvent<TAggregate, TIdentity>>> StoreAsync<
            TAggregate,
            TIdentity
        >(
            TIdentity id,
            IReadOnlyCollection<IUncommittedEvent> uncommittedDomainEvents,
            ISourceId sourceId,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;

        Task<AllEventsPage> LoadAllEventsAsync(
            GlobalPosition globalPosition,
            int pageSize,
            IEventUpgradeContext eventUpgradeContext,
            CancellationToken cancellationToken
        );

        Task<IReadOnlyCollection<IDomainEvent<TAggregate, TIdentity>>> LoadEventsAsync<
            TAggregate,
            TIdentity
        >(TIdentity id, CancellationToken cancellationToken)
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;

        Task<IReadOnlyCollection<IDomainEvent<TAggregate, TIdentity>>> LoadEventsAsync<
            TAggregate,
            TIdentity
        >(TIdentity id, ulong fromEventSequenceNumber, CancellationToken cancellationToken)
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;

        Task DeleteAggregateAsync<TAggregate, TIdentity>(
            TIdentity id,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;
    }
}
