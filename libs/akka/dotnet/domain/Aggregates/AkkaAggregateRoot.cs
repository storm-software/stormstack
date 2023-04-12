using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Akka.Domain.Aggregates
{
    public abstract class AkkaAggregateRoot<TAggregate, TIdentity>
        : AggregateRoot<TAggregate, TIdentity>,
            IAggregateRoot<TIdentity>
        where TAggregate : AkkaAggregateRoot<TAggregate, TIdentity>
        where TIdentity : IIdentity
    {
        public virtual IReadOnlyCollection<IDomainEvent> GetEmittedEvents()
        {
            return UncommittedEvents
                .Select(
                    (e, i) =>
                        new DomainEvent(
                            e.AggregateEvent,
                            e.Metadata,
                            DateTimeOffset.UtcNow,
                            Id.Value,
                            Version
                        )
                )
                .ToList();
        }

        protected AkkaAggregateRoot(TIdentity id)
            : base(id) { }
    }
}
