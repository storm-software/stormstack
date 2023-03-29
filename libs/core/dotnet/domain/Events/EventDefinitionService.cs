using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Settings;

namespace OpenSystem.Core.Domain.Events
{
    public class EventDefinitionService
        : BaseVersionDefinitionService<IAggregateEvent, EventVersionAttribute, EventDefinition>,
            IEventDefinitionService
    {
        public EventDefinitionService(
            ILogger<EventDefinitionService> logger,
            ILoadedVersions loadedVersions
        )
            : base(logger)
        {
            Load(loadedVersions.Events);
        }

        protected override EventDefinition CreateDefinition(uint version, Type type, string name)
        {
            return new EventDefinition(version, type, name);
        }
    }
}
