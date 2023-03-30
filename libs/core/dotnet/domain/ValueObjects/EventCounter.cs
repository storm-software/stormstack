using FluentValidation;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public class EventCounter : PositiveInteger
    {
        public EventCounter(int value)
            : base(value) { }

        public static implicit operator EventCounter(int i) => new EventCounter(i);

        public static implicit operator int(EventCounter baseInteger) => baseInteger.Value;

        public static implicit operator decimal(EventCounter baseInteger) => baseInteger.Value;

        public static EventCounter operator +(EventCounter a, EventCounter b) =>
            new EventCounter(a.Value + b.Value);

        public static EventCounter operator -(EventCounter a, EventCounter b) =>
            new EventCounter(a.Value - b.Value);

        public static EventCounter operator ++(EventCounter a) => new EventCounter(a.Value + 1);

        public static bool operator >(EventCounter a, EventCounter b) => a.Value > b.Value;

        public static bool operator >=(EventCounter a, EventCounter b) => a.Value >= b.Value;

        public static bool operator <(EventCounter a, EventCounter b) => a.Value < b.Value;

        public static bool operator <=(EventCounter a, EventCounter b) => a.Value <= b.Value;

        public new IEnumerable<FieldValidationResult> Validate(int value, string? fieldName = null)
        {
            if (Value <= 0)
                yield return FieldValidationResult.Failure(
                    fieldName,
                    ResultCodeValidation.NumericValueMustBePositive,
                    value
                );
        }
    }
}
