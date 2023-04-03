using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Jobs
{
    public class JobDefinition : VersionDefinition
    {
        public JobDefinition(ulong version, Type type, string name)
            : base(version, type, name) { }
    }
}
