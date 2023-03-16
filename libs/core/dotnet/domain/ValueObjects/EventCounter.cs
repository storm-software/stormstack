using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
	public class EventCounter
    : PositiveInteger
	{
    public static implicit operator EventCounter(int i) => EventCounter.Create(i);

    public static implicit operator int(EventCounter baseInteger) => baseInteger.Value;

    public static implicit operator decimal(EventCounter baseInteger) => baseInteger.Value;

    public static EventCounter operator + (EventCounter a,
      EventCounter b) => EventCounter.Create(a.Value + b.Value);

    public static EventCounter operator - (EventCounter a,
      EventCounter b) => EventCounter.Create(a.Value - b.Value);

    public static EventCounter operator ++ (EventCounter a) => EventCounter.Create(a.Value + 1);

    public static bool operator > (EventCounter a,
      EventCounter b) => a.Value > b.Value;

    public static bool operator >= (EventCounter a,
      EventCounter b) => a.Value >= b.Value;

    public static bool operator < (EventCounter a,
      EventCounter b) => a.Value < b.Value;

    public static bool operator <= (EventCounter a,
      EventCounter b) => a.Value <= b.Value;

    public static new EventCounter Create(int i)
    {
      EventCounter x = new EventCounter();
      x.Value = i;
      x.InnerValidate();

      return x;
    }

    protected override Result InnerValidate()
    {
      var ret = base.InnerValidate();
      if (ret.Failed)
        return ret;

      if (Value <= 0)
          return Result.Failure(typeof(ResultCodeValidation),
            ResultCodeValidation.NumericValueMustBePositive);

      return Result.Success();
    }
	}
}
