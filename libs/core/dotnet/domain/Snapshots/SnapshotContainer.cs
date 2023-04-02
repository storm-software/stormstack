namespace OpenSystem.Core.Domain.Snapshots
{
    public class SnapshotContainer
    {
        public SnapshotContainer(ISnapshot snapshot, ISnapshotMetadata metadata)
        {
            Snapshot = snapshot;
            Metadata = metadata;
        }

        public ISnapshot Snapshot { get; }
        public ISnapshotMetadata Metadata { get; }
    }
}
