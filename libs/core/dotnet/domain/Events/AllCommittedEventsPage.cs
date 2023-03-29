using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public class AllCommittedEventsPage
    {
        public GlobalPosition NextGlobalPosition { get; }

        public IReadOnlyCollection<ICommittedDomainEvent> CommittedDomainEvents { get; }

        public AllCommittedEventsPage(
            GlobalPosition nextGlobalPosition,
            IReadOnlyCollection<ICommittedDomainEvent> committedDomainEvents
        )
        {
            NextGlobalPosition = nextGlobalPosition;
            CommittedDomainEvents = committedDomainEvents;
        }
    }
}
