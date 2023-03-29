using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Sagas
{
    public interface ISagaIsStartedBy<TAggregate, in TIdentity, in TAggregateEvent>
        : ISagaHandles<TAggregate, TIdentity, TAggregateEvent>
        where TAggregateEvent : IAggregateEvent<TAggregate, TIdentity>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity { }
}
