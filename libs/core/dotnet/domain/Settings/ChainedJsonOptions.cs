using System.Text.Json;

namespace OpenSystem.Core.Domain.Settings
{
    public class ChainedJsonOptions : IJsonOptions
    {
        private readonly Action<JsonSerializerOptions> _action;
        private readonly IJsonOptions _parent;

        public ChainedJsonOptions(IJsonOptions parent, Action<JsonSerializerOptions> action)
        {
            _parent = parent;
            _action = action;
        }

        void IJsonOptions.Apply(JsonSerializerOptions settings)
        {
            _parent.Apply(settings);
            _action.Invoke(settings);
        }
    }
}
