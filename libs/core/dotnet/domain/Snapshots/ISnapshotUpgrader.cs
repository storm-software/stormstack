using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.Snapshots
{
    public interface ISnapshotUpgrader<in TFrom, TTo> : IVersionUpgrader<TFrom, TTo>
        where TFrom : ISnapshot
        where TTo : ISnapshot { }
}
