using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Reaction.Domain.Aggregates;

namespace OpenSystem.Reaction.Domain.Events
{
    [EventVersion("ReactionAdded", 1)]
    public class ReactionAddedEvent : AggregateEvent<ReactionAggregate, ReactionId>, IAggregateEvent
    {
        public ReactionTypes Type { get; }

        public string UserId { get; }

        public ReactionAddedEvent(string userId, ReactionTypes type)
            : base()
        {
            Type = type;
            UserId = userId;
        }
    }
}
