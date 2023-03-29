using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.Events
{
    public interface IEventDefinitionService
        : IVersionDefinitionService<EventVersionAttribute, EventDefinition> { }
}
