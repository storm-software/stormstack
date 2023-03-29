using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public class AllEventsPage
    {
        public GlobalPosition NextGlobalPosition { get; }

        public IReadOnlyCollection<IDomainEvent> DomainEvents { get; }

        public AllEventsPage(
            GlobalPosition nextGlobalPosition,
            IReadOnlyCollection<IDomainEvent> domainEvents
        )
        {
            NextGlobalPosition = nextGlobalPosition;
            DomainEvents = domainEvents;
        }
    }
}
