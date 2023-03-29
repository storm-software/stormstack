using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Metadata
{
    /// <summary>
    /// Adds key <c>guid</c> with a new <c>Guid</c> for every event (used for testing)
    /// </summary>
    public class GuidMetadataProvider : IMetadataProvider
    {
        public IEnumerable<KeyValuePair<string, string>> ProvideMetadata<TAggregate, TIdentity>(
            TIdentity id,
            IAggregateEvent aggregateEvent,
            IMetadata metadata
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            yield return new KeyValuePair<string, string>("guid", Guid.NewGuid().ToString());
        }
    }
}
