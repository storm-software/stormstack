using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Snapshots
{
    public class SnapshotEveryFewVersionsStrategy : ISnapshotStrategy
    {
        public const int DefaultSnapshotAfterVersions = 100;

        public static ISnapshotStrategy Default { get; } = With();

        public static ISnapshotStrategy With(
            int snapshotAfterVersions = DefaultSnapshotAfterVersions
        )
        {
            return new SnapshotEveryFewVersionsStrategy(snapshotAfterVersions);
        }

        private readonly int _snapshotAfterVersions;

        private SnapshotEveryFewVersionsStrategy(int snapshotAfterVersions)
        {
            _snapshotAfterVersions = snapshotAfterVersions;
        }

        public Task<bool> ShouldCreateSnapshotAsync(
            ISnapshotAggregateRoot snapshotAggregateRoot,
            CancellationToken cancellationToken
        )
        {
            var currentSnapshotVersion = snapshotAggregateRoot.SnapshotVersion.GetValueOrDefault();
            var shouldCreateSnapshot =
                snapshotAggregateRoot.Version - currentSnapshotVersion
                >= ulong.CreateChecked(_snapshotAfterVersions);

            return Task.FromResult(shouldCreateSnapshot);
        }
    }
}
