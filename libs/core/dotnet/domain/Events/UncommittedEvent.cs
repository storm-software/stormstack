namespace OpenSystem.Core.Domain.Events
{
    public class UncommittedEvent : IUncommittedEvent
    {
        public IAggregateEvent AggregateEvent { get; }
        public IMetadata Metadata { get; }

        public UncommittedEvent(IAggregateEvent aggregateEvent, IMetadata metadata)
        {
            AggregateEvent = aggregateEvent;
            Metadata = metadata;
        }
    }
}
