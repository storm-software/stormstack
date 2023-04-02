namespace OpenSystem.Core.Domain.Snapshots
{
    public class CommittedSnapshot
    {
        public string SerializedMetadata { get; }
        public string SerializedData { get; }

        public CommittedSnapshot(string serializedMetadata, string serializedData)
        {
            SerializedMetadata = serializedMetadata;
            SerializedData = serializedData;
        }
    }
}
