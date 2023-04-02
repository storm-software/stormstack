using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Commands
{
    public class CommandDefinition : VersionDefinition
    {
        public CommandDefinition(ulong version, Type type, string name)
            : base(version, type, name) { }
    }
}
