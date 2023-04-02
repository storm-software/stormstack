using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Reaction.Domain.ValueObjects
{
    public class ReactionId : Identity<ReactionId>
    {
        public ReactionId(string value)
            : base(value) { }
    }
}
