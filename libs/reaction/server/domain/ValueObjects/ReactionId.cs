using System.Text.Json.Serialization;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Reaction.Domain.ValueObjects
{
    [JsonConverter(typeof(SingleValueObjectConverter))]
    public class ReactionId : Identity<ReactionId>
    {
        public ReactionId(string value)
            : base(value) { }
    }
}
