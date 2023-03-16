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
	public class PositiveInteger
    : BaseInteger
	{
    public static implicit operator PositiveInteger(int i) => PositiveInteger.Create(i);

    public static implicit operator int(PositiveInteger baseInteger) => baseInteger.Value;

    public static implicit operator decimal(PositiveInteger baseInteger) => baseInteger.Value;

    public static PositiveInteger operator + (PositiveInteger a,
      PositiveInteger b) => PositiveInteger.Create(a.Value + b.Value);

    public static PositiveInteger operator - (PositiveInteger a,
      PositiveInteger b) => PositiveInteger.Create(a.Value - b.Value);

    public static PositiveInteger operator ++ (PositiveInteger a) => PositiveInteger.Create(a.Value + 1);

    public static bool operator > (PositiveInteger a,
      PositiveInteger b) => a.Value > b.Value;

    public static bool operator >= (PositiveInteger a,
      PositiveInteger b) => a.Value >= b.Value;

    public static bool operator < (PositiveInteger a,
      PositiveInteger b) => a.Value < b.Value;

    public static bool operator <= (PositiveInteger a,
      PositiveInteger b) => a.Value <= b.Value;

    public static new PositiveInteger Create(int i)
    {
        PositiveInteger x = new PositiveInteger();
        x.Value = i;
        x.InnerValidate();

        return x;
    }

    protected override Result InnerValidate()
    {
      if (Value < 0)
          return Result.Failure(typeof(ResultCodeValidation),
            ResultCodeValidation.NumericValueMustBePositive);

      return Result.Success();
    }
	}
}
