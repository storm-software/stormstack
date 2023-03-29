namespace OpenSystem.Core.Domain.Events
{
    public interface ICommittedDomainEvent
    {
        string AggregateId { get; }

        string Data { get; }

        string Metadata { get; }

        uint AggregateSequenceNumber { get; }
    }
}
