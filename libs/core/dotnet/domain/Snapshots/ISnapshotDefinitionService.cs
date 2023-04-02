using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.Snapshots
{
    public interface ISnapshotDefinitionService
        : IVersionDefinitionService<SnapshotVersionAttribute, SnapshotDefinition> { }
}
