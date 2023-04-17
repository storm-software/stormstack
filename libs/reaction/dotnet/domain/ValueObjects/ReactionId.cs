using System.Text.Json.Serialization;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Reaction.Domain.ValueObjects
{
    [JsonConverter(typeof(SingleValueObjectConverter))]
    public class ReactionId : Identity<ReactionId>
    {
        public static ReactionId NewDeterministic(string name)
        {
            var guid = GuidUtility.Deterministic.CreateGuid(
                GuidUtility.Deterministic.Namespaces.Aggregates,
                name
            );
            return With(guid);
        }

        public ReactionId(string value)
            : base(value) { }
    }
}
