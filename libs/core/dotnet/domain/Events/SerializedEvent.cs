namespace OpenSystem.Core.Domain.Events
{
    public class SerializedEvent : ISerializedEvent
    {
        public string SerializedMetadata { get; }

        public string SerializedData { get; }

        public ulong AggregateSequenceNumber { get; }

        public IMetadata Metadata { get; }

        public SerializedEvent(
            string serializedMetadata,
            string serializedData,
            ulong aggregateSequenceNumber,
            IMetadata metadata
        )
        {
            SerializedMetadata = serializedMetadata;
            SerializedData = serializedData;
            AggregateSequenceNumber = aggregateSequenceNumber;
            Metadata = metadata;
        }
    }
}
