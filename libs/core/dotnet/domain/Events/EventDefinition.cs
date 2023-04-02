using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Events
{
    public class EventDefinition : VersionDefinition
    {
        public EventDefinition(ulong version, Type type, string name)
            : base(version, type, name) { }
    }
}
