using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Reaction.Domain.ValueObjects
{
    public class ReactionId : AggregateId
    {
        public ReactionId(string value)
            : base(value) { }

        public static implicit operator ReactionId(string guid) => guid;

        public static implicit operator string(ReactionId entityId) => entityId.Value;
    }
}
