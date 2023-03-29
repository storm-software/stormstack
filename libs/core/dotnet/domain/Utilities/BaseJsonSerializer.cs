using System.Text.Json;
using OpenSystem.Core.Domain.Settings;

namespace OpenSystem.Core.Domain.Utilities
{
    public class BaseJsonSerializer : IJsonSerializer
    {
        private readonly JsonSerializerOptions _settingsNotIndented = new JsonSerializerOptions
        {
            WriteIndented = false
        };

        private readonly JsonSerializerOptions _settingsIndented = new JsonSerializerOptions
        {
            WriteIndented = true
        };

        public BaseJsonSerializer(IJsonOptions? options = null) { }

        public string Serialize(object obj, bool indented = false)
        {
            var settings = indented ? _settingsIndented : _settingsNotIndented;
            return JsonSerializer.Serialize(obj, settings);
        }

        public object Deserialize(string json, Type type)
        {
            return JsonSerializer.Deserialize(json, type, _settingsNotIndented);
        }

        public T Deserialize<T>(string json)
        {
            return JsonSerializer.Deserialize<T>(json, _settingsNotIndented);
        }
    }
}
