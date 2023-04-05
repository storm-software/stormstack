using System.Text.Json.Serialization;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Reaction.Domain.ValueObjects
{
    [JsonConverter(typeof(SingleValueObjectConverter))]
    public class ReactionDetailId : Identity<ReactionDetailId>
    {
        public ReactionDetailId(string value)
            : base(value) { }
    }
}
