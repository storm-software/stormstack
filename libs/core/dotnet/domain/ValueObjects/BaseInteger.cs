using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using FluentValidation;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public class BaseInteger : SingleValueObject<int>
    {
        public BaseInteger(int value)
            : base(value) { }

        public static implicit operator BaseInteger(int i) => new BaseInteger(i);

        public static implicit operator int(BaseInteger baseInteger) => baseInteger.Value;

        public static implicit operator decimal(BaseInteger baseInteger) => baseInteger.Value;

        public static BaseInteger operator +(BaseInteger a, BaseInteger b) =>
            new BaseInteger(a.Value + b.Value);

        public static BaseInteger operator -(BaseInteger a, BaseInteger b) =>
            new BaseInteger(a.Value - b.Value);

        public static BaseInteger operator ++(BaseInteger a) => new BaseInteger(a.Value + 1);

        public static bool operator >(BaseInteger a, BaseInteger b) => a.Value > b.Value;

        public static bool operator >=(BaseInteger a, BaseInteger b) => a.Value >= b.Value;

        public static bool operator <(BaseInteger a, BaseInteger b) => a.Value < b.Value;

        public static bool operator <=(BaseInteger a, BaseInteger b) => a.Value <= b.Value;

        public static BaseInteger MaxValue => new BaseInteger(int.MaxValue);

        public static BaseInteger MinValue => new BaseInteger(int.MinValue);

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
