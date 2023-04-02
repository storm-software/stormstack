using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Snapshots
{
    public interface ISnapshotPersistence
    {
        Task<CommittedSnapshot> GetSnapshotAsync(
            Type aggregateType,
            IIdentity identity,
            CancellationToken cancellationToken
        );

        Task SetSnapshotAsync(
            Type aggregateType,
            IIdentity identity,
            SerializedSnapshot serializedSnapshot,
            CancellationToken cancellationToken
        );

        Task DeleteSnapshotAsync(
            Type aggregateType,
            IIdentity identity,
            CancellationToken cancellationToken
        );

        Task PurgeSnapshotsAsync(Type aggregateType, CancellationToken cancellationToken);

        Task PurgeSnapshotsAsync(CancellationToken cancellationToken);
    }
}
