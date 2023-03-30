using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Reaction.Domain.ValueObjects
{
    public class ReactionId : Identity<ReactionId>
    {
        public ReactionId(string value)
            : base(value) { }

        public static implicit operator ReactionId(string id) => id;

        public static implicit operator string(ReactionId reactionId) => reactionId.Value;
    }
}
