using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.Snapshots
{
    public class SnapshotDefinitionService
        : BaseVersionDefinitionService<ISnapshot, SnapshotVersionAttribute, SnapshotDefinition>,
            ISnapshotDefinitionService
    {
        public SnapshotDefinitionService(
            ILogger<SnapshotDefinitionService> logger,
            ILoadedVersions<ISnapshot> loadedVersions
        )
            : base(logger)
        {
            Load(loadedVersions.Items);
        }

        protected override SnapshotDefinition CreateDefinition(
            ulong version,
            Type type,
            string name
        )
        {
            return new SnapshotDefinition(version, type, name);
        }
    }
}
