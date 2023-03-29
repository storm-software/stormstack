namespace OpenSystem.Core.Domain.Events
{
    public interface ISerializedEvent
    {
        string SerializedMetadata { get; }

        string SerializedData { get; }

        uint AggregateSequenceNumber { get; }

        IMetadata Metadata { get; }
    }
}
