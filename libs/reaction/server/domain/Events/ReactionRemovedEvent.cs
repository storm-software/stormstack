using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Reaction.Domain.Aggregates;

namespace OpenSystem.Reaction.Domain.Events
{
    [EventVersion("ReactionRemoved", 1)]
    public class ReactionRemovedEvent : AggregateEvent<ReactionAggregate, ReactionId>
    {
        public ReactionTypes Type { get; }

        public ReactionRemovedEvent(ReactionTypes type)
        {
            Type = type;
        }
    }
}
