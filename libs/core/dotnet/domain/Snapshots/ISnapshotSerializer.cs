using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.Snapshots
{
    public interface ISnapshotSerializer
    {
        Task<SerializedSnapshot> SerializeAsync<TAggregate, TIdentity, TSnapshot>(
            SnapshotContainer snapshotContainer,
            CancellationToken cancellationToken
        )
            where TAggregate : ISnapshotAggregateRoot<TIdentity, TSnapshot>
            where TIdentity : IIdentity
            where TSnapshot : ISnapshot;

        Task<SnapshotContainer> DeserializeAsync<TAggregate, TIdentity, TSnapshot>(
            CommittedSnapshot committedSnapshot,
            CancellationToken cancellationToken
        )
            where TAggregate : ISnapshotAggregateRoot<TIdentity, TSnapshot>
            where TIdentity : IIdentity
            where TSnapshot : ISnapshot;
    }
}
