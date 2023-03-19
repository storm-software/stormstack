using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace OpenSystem.Core.Infrastructure.Persistence.ValueConverters
{
  public class EnumStringValueConverter<TEnum> : ValueConverter<TEnum, string>
  {
      public EnumStringValueConverter()
        : base(value => value != null
          ? value.ToString().ToUpper()
          : null,
          value => (TEnum)Enum.Parse(typeof(TEnum),
            value,
            true)
        )
      {
      }
  }
}
