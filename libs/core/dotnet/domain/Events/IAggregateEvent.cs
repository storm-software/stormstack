using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.Events
{
    public interface IAggregateEvent : IVersioned
    {
        string ToTopic();
    }

    public interface IAggregateEvent<TAggregate, TIdentity> : IAggregateEvent
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity { }
}
