using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Events
{
    public interface IMetadataProvider
    {
        IEnumerable<KeyValuePair<string, string>> ProvideMetadata<TAggregate, TIdentity>(
            TIdentity id,
            IAggregateEvent aggregateEvent,
            IMetadata metadata
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;
    }
}
