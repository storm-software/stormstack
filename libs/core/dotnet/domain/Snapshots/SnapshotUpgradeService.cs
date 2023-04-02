using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.Snapshots
{
    public class SnapshotUpgradeService
        : VersionUpgradeService<
            SnapshotVersionAttribute,
            SnapshotDefinition,
            ISnapshot,
            ISnapshotDefinitionService
        >,
            ISnapshotUpgradeService
    {
        public SnapshotUpgradeService(
            ILogger<SnapshotUpgradeService> logger,
            IServiceProvider serviceProvider,
            ISnapshotDefinitionService definitionService
        )
            : base(logger, serviceProvider, definitionService) { }

        protected override Type CreateUpgraderType(Type fromType, Type toType)
        {
            return typeof(ISnapshotUpgrader<,>).MakeGenericType(fromType, toType);
        }
    }
}
