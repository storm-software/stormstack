namespace OpenSystem.Core.Domain.Events
{
    public interface IEmit<in TAggregateEvent>
        where TAggregateEvent : IAggregateEvent
    {
        void Apply(TAggregateEvent aggregateEvent);
    }
}
