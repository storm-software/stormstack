using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace OpenSystem.Core.Infrastructure.Persistence.ValueConverters
{
  public class EnumIntegerValueConverter<TEnum> : ValueConverter<TEnum, int>
  {
      public EnumIntegerValueConverter()
        : base(value => Convert.ToInt32(value),
            value => (TEnum)Enum.ToObject(typeof(TEnum),
              value))
      {
      }
  }
}
