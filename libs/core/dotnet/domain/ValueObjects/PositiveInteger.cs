using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using FluentValidation;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public class PositiveInteger : BaseInteger
    {
        public PositiveInteger(int value)
            : base(value) { }

        public static implicit operator PositiveInteger(int i) => new PositiveInteger(i);

        public static implicit operator int(PositiveInteger baseInteger) => baseInteger.Value;

        public static implicit operator decimal(PositiveInteger baseInteger) => baseInteger.Value;

        public static PositiveInteger operator +(PositiveInteger a, PositiveInteger b) =>
            new PositiveInteger(a.Value + b.Value);

        public static PositiveInteger operator -(PositiveInteger a, PositiveInteger b) =>
            new PositiveInteger(a.Value - b.Value);

        public static PositiveInteger operator ++(PositiveInteger a) =>
            new PositiveInteger(a.Value + 1);

        public static bool operator >(PositiveInteger a, PositiveInteger b) => a.Value > b.Value;

        public static bool operator >=(PositiveInteger a, PositiveInteger b) => a.Value >= b.Value;

        public static bool operator <(PositiveInteger a, PositiveInteger b) => a.Value < b.Value;

        public static bool operator <=(PositiveInteger a, PositiveInteger b) => a.Value <= b.Value;

        protected override Result InnerValidate(ValidationContext<object> validationContext)
        {
            if (Value < 0)
                return Result.Failure(
                    typeof(ResultCodeValidation),
                    ResultCodeValidation.NumericValueMustBePositive
                );

            return Result.Success();
        }
    }
}
