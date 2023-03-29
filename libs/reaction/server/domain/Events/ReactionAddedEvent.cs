using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Reaction.Domain.Aggregates;

namespace OpenSystem.Reaction.Domain.Events
{
    [EventVersion("ReactionAdded", 1)]
    public class ReactionAddedEvent : AggregateEvent<ReactionAggregate, ReactionId>
    {
        public ReactionTypes Type { get; }

        public ReactionAddedEvent(ReactionTypes type)
        {
            Type = type;
        }
    }
}
