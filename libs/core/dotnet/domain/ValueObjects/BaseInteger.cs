using System;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ValueObjects;
using System.Linq;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;

namespace OpenSystem.Core.Domain.ValueObjects
{
	public class BaseInteger
    : ValueObject<int, BaseInteger>
	{
    public static implicit operator BaseInteger(int i) => BaseInteger.Create(i);

    public static implicit operator int(BaseInteger baseInteger) => baseInteger.Value;

    public static implicit operator decimal(BaseInteger baseInteger) => baseInteger.Value;

    public static BaseInteger operator + (BaseInteger a,
      BaseInteger b) => BaseInteger.Create(a.Value + b.Value);

    public static BaseInteger operator - (BaseInteger a,
      BaseInteger b) => BaseInteger.Create(a.Value - b.Value);

    public static BaseInteger operator ++ (BaseInteger a) => BaseInteger.Create(a.Value + 1);

    public static bool operator > (BaseInteger a,
      BaseInteger b) => a.Value > b.Value;

    public static bool operator >= (BaseInteger a,
      BaseInteger b) => a.Value >= b.Value;

    public static bool operator < (BaseInteger a,
      BaseInteger b) => a.Value < b.Value;

    public static bool operator <= (BaseInteger a,
      BaseInteger b) => a.Value <= b.Value;

    public static BaseInteger MaxValue => BaseInteger.Create(int.MaxValue);

    public static BaseInteger MinValue => BaseInteger.Create(int.MinValue);

    protected override Result InnerValidate()
    {
      if (Value < 0)
          return Result.Failure(typeof(ResultCodeValidation),
            ResultCodeValidation.NumericValueMustBePositive);

      return Result.Success();
    }
	}
}
