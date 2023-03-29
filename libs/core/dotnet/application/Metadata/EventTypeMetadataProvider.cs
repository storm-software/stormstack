using System.Reflection;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Metadata
{
    public class EventTypeMetadataProvider : IMetadataProvider
    {
        public IEnumerable<KeyValuePair<string, string>> ProvideMetadata<TAggregate, TIdentity>(
            TIdentity id,
            IAggregateEvent aggregateEvent,
            IMetadata metadata
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            var aggregateEventType = aggregateEvent.GetType();
            var assembly = aggregateEventType.GetTypeInfo().Assembly;
            var name = assembly.GetName();

            yield return new KeyValuePair<string, string>(
                "event_type_assembly_version",
                name.Version.ToString()
            );
            yield return new KeyValuePair<string, string>("event_type_assembly_name", name.Name);
            yield return new KeyValuePair<string, string>(
                "event_type_fullname",
                aggregateEventType.FullName
            );
        }
    }
}
