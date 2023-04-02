using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Snapshots
{
    public interface ISnapshotStrategy
    {
        Task<bool> ShouldCreateSnapshotAsync(
            ISnapshotAggregateRoot snapshotAggregateRoot,
            CancellationToken cancellationToken
        );
    }
}
