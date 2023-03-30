namespace OpenSystem.Core.Domain.ValueObjects
{
    public class EventId : Identity<EventId>, IEventId
    {
        public EventId(string value)
            : base(value) { }
    }
}
