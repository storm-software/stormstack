using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.Events
{
    public abstract class AggregateEvent<TAggregate, TIdentity>
        : IAggregateEvent<TAggregate, TIdentity>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
    {
        public static string ToTopic(Type eventType, ulong version)
        {
            return $"{eventType.PrettyPrint()}-v{version}";
        }

        public ulong Version { get; set; } = 1;

        public string ToTopic()
        {
            return AggregateEvent<TAggregate, TIdentity>.ToTopic(GetType(), Version);
        }

        public override string ToString()
        {
            return $"{typeof(TAggregate).PrettyPrint()}/{GetType().PrettyPrint()}";
        }
    }
}
