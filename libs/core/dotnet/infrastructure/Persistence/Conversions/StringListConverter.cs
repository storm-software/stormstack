using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OpenSystem.Core.Domain.Constants;

namespace OpenSystem.Core.Infrastructure.Persistence.Conversions
{
  public class StringListConverter : ValueConverter<List<string>, string>
  {
      public StringListConverter()
        : base(value => JsonSerializer.Serialize(value,
          DefaultJsonSerializerOptions.Options),
            value => JsonSerializer.Deserialize<List<string>>(string.IsNullOrEmpty(value)
                ? "[]"
                : value,
              DefaultJsonSerializerOptions.Options) ?? new()
        )
      {
      }
  }
}
