using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public class EventDefinitionService
        : BaseVersionDefinitionService<IAggregateEvent, EventVersionAttribute, EventDefinition>,
            IEventDefinitionService
    {
        public EventDefinitionService(
            ILogger<EventDefinitionService> logger,
            ILoadedVersions<IAggregateEvent> loadedVersions
        )
            : base(logger)
        {
            Load(loadedVersions.Items);
        }

        protected override EventDefinition CreateDefinition(ulong version, Type type, string name)
        {
            return new EventDefinition(version, type, name);
        }
    }
}
