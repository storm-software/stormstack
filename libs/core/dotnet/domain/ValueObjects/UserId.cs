using System.Text.Json.Serialization;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.ValueObjects
{
    [JsonConverter(typeof(SingleValueObjectConverter))]
    public class UserId : Identity<UserId>
    {
        public UserId(string value)
            : base(value) { }
    }
}
