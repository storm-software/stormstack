namespace OpenSystem.Core.Domain.Snapshots
{
    public class SerializedSnapshot : CommittedSnapshot
    {
        public ISnapshotMetadata Metadata { get; }

        public SerializedSnapshot(
            string serializedMetadata,
            string serializedData,
            ISnapshotMetadata metadata
        )
            : base(serializedMetadata, serializedData)
        {
            Metadata = metadata;
        }
    }
}
