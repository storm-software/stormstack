using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Snapshots
{
    public interface ISnapshotStore
    {
        Task<SnapshotContainer> LoadSnapshotAsync<TAggregate, TIdentity, TSnapshot>(
            TIdentity identity,
            CancellationToken cancellationToken
        )
            where TAggregate : ISnapshotAggregateRoot<TIdentity, TSnapshot>
            where TIdentity : IIdentity
            where TSnapshot : ISnapshot;

        Task StoreSnapshotAsync<TAggregate, TIdentity, TSnapshot>(
            TIdentity identity,
            SnapshotContainer snapshotContainer,
            CancellationToken cancellationToken
        )
            where TAggregate : ISnapshotAggregateRoot<TIdentity, TSnapshot>
            where TIdentity : IIdentity
            where TSnapshot : ISnapshot;
    }
}
