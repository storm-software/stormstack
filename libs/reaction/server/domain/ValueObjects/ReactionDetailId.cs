using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Reaction.Domain.ValueObjects
{
    public class ReactionDetailId : Identity<ReactionDetailId>
    {
        public ReactionDetailId(string value)
            : base(value) { }
    }
}
