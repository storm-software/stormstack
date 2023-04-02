using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Jobs
{
    public class JobDefinition : VersionDefinition
    {
        public JobDefinition(ulong version, Type type, string name)
            : base(version, type, name) { }
    }
}
