using System.Text.Json;

namespace OpenSystem.Core.Domain.Settings
{
    public interface IJsonOptions
    {
        void Apply(JsonSerializerOptions settings);
    }
}
