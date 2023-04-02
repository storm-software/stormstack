using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Snapshots
{
    public class SnapshotDefinition : VersionDefinition
    {
        public SnapshotDefinition(ulong version, Type type, string name)
            : base(version, type, name) { }
    }
}
