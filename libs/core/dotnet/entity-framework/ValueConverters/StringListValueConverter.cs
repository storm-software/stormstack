using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OpenSystem.Core.Domain.Constants;

namespace OpenSystem.Core.EntityFramework.ValueConverters
{
    public class StringListValueConverter : ValueConverter<List<string>, string>
    {
        public StringListValueConverter()
            : base(
                value => JsonSerializer.Serialize(value, DefaultJsonSerializerOptions.Options),
                value =>
                    JsonSerializer.Deserialize<List<string>>(
                        string.IsNullOrEmpty(value) ? "[]" : value,
                        DefaultJsonSerializerOptions.Options
                    ) ?? new()
            ) { }
    }
}
