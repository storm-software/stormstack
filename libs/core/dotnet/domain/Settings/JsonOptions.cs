using System.Text.Json;

namespace OpenSystem.Core.Domain.Settings
{
    public class JsonOptions : IJsonOptions
    {
        public void Apply(JsonSerializerOptions settings) { }

        public static JsonOptions New => new JsonOptions();
    }
}
