using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Reaction.Domain.ValueObjects
{
    public class ReactionDetailId : EntityId
    {
        public ReactionDetailId(string value)
            : base(value) { }

        public static implicit operator ReactionDetailId(string guid) => guid;

        public static implicit operator string(ReactionDetailId entityId) => entityId.Value;
    }
}
