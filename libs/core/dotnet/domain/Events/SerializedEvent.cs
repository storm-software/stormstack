namespace OpenSystem.Core.Domain.Events
{
    public class SerializedEvent : ISerializedEvent
    {
        public string SerializedMetadata { get; }

        public string SerializedData { get; }

        public uint AggregateSequenceNumber { get; }

        public IMetadata Metadata { get; }

        public SerializedEvent(
            string serializedMetadata,
            string serializedData,
            uint aggregateSequenceNumber,
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
