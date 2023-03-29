using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public interface IEventApplier<TAggregate, TIdentity>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
    {
        bool Apply(TAggregate aggregate, IAggregateEvent<TAggregate, TIdentity> aggregateEvent);
    }
}
