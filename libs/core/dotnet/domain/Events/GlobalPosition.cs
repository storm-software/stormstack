using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Events
{
    public class GlobalPosition : SingleValueObject<string>
    {
        public static GlobalPosition Start => new GlobalPosition(string.Empty);

        public bool IsStart => string.IsNullOrEmpty(Value);

        public GlobalPosition(string value)
            : base(value ?? string.Empty) { }
    }
}
