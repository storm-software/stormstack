namespace OpenSystem.Core.Domain.Events
{
    public interface IUncommittedEvent
    {
        IAggregateEvent AggregateEvent { get; }
        IMetadata Metadata { get; }
    }
}
