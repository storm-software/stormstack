using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Events
{
    public class MetadataContainer : Dictionary<string, string>
    {
        public MetadataContainer() { }

        public MetadataContainer(IDictionary<string, string> keyValuePairs)
            : base(keyValuePairs) { }

        public MetadataContainer(IEnumerable<KeyValuePair<string, string>> keyValuePairs)
            : base(keyValuePairs.ToDictionary(kv => kv.Key, kv => kv.Value)) { }

        public MetadataContainer(params KeyValuePair<string, string>[] keyValuePairs)
            : this((IEnumerable<KeyValuePair<string, string>>)keyValuePairs) { }

        public void AddRange(params KeyValuePair<string, string>[] keyValuePairs)
        {
            AddRange((IEnumerable<KeyValuePair<string, string>>)keyValuePairs);
        }

        public void AddRange(IEnumerable<KeyValuePair<string, string>> keyValuePairs)
        {
            foreach (var kv in keyValuePairs)
            {
                Add(kv.Key, kv.Value);
            }
        }

        public override string ToString()
        {
            return string.Join(Environment.NewLine, this.Select(kv => $"{kv.Key}: {kv.Value}"));
        }

        public string GetMetadataValue(string key)
        {
            return GetMetadataValue(key, s => s);
        }

        public T GetMetadataValue<T>(string key, Func<string, T> converter)
        {
            if (!TryGetValue(key, out var value))
                throw new GeneralProcessingException(
                    typeof(ResultCodeApplication),
                    ResultCodeApplication.MetadataKeyNotFound
                );

            try
            {
                return converter(value);
            }
            catch (Exception e)
            {
                throw new GeneralProcessingException(
                    typeof(ResultCodeApplication),
                    ResultCodeApplication.MetadataKeyNotFound
                );
            }
        }
    }
}
