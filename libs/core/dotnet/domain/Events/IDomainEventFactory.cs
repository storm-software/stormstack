using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public interface IDomainEventFactory
    {
        IEnumerable<IDomainEvent> Create(IEnumerable<IUncommittedEvent> uncommittedEvents);

        IDomainEvent Create(
            IAggregateEvent aggregateEvent,
            IMetadata metadata,
            string aggregateIdentity,
            ulong aggregateSequenceNumber
        );

        IDomainEvent<TAggregate, TIdentity> Create<TAggregate, TIdentity>(
            IAggregateEvent aggregateEvent,
            IMetadata metadata,
            TIdentity id,
            ulong aggregateSequenceNumber
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;

        IDomainEvent<TAggregate, TIdentity> Upgrade<TAggregate, TIdentity>(
            IDomainEvent domainEvent,
            IAggregateEvent aggregateEvent
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;
    }
}
