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

        protected override Result InnerValidate(ValidationContext<object> validationContext)
        {
            var ret = base.InnerValidate(validationContext);
            if (ret.Failed)
                return ret;

            if (Value <= 0)
                return Result.Failure(
                    typeof(ResultCodeValidation),
                    ResultCodeValidation.NumericValueMustBePositive
                );

            return Result.Success();
        }
    }
}
