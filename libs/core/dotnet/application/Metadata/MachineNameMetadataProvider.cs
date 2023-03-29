using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Metadata
{
    public class MachineNameMetadataProvider : IMetadataProvider
    {
        private static readonly IEnumerable<KeyValuePair<string, string>> Metadata;

        static MachineNameMetadataProvider()
        {
            Metadata = new[]
            {
                new KeyValuePair<string, string>(
                    "environment_machinename",
                    Environment.MachineName
                ),
            };
        }

        public IEnumerable<KeyValuePair<string, string>> ProvideMetadata<TAggregate, TIdentity>(
            TIdentity id,
            IAggregateEvent aggregateEvent,
            IMetadata metadata
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            return Metadata;
        }
    }
}
