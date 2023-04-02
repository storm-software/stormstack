using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Snapshots
{
    public interface ISnapshotAggregateRoot : IAggregateRoot
    {
        ulong? SnapshotVersion { get; }
    }

    public interface ISnapshotAggregateRoot<out TIdentity, TSnapshot>
        : ISnapshotAggregateRoot,
            IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
        where TSnapshot : ISnapshot { }
}
