using System.Text.Json.Serialization;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Events
{
    public class Metadata : MetadataContainer, IMetadata
    {
        public static IMetadata Empty { get; } = new Metadata();

        public static IMetadata With(IEnumerable<KeyValuePair<string, string>> keyValuePairs)
        {
            return new Metadata(keyValuePairs);
        }

        public static IMetadata With(params KeyValuePair<string, string>[] keyValuePairs)
        {
            return new Metadata(keyValuePairs);
        }

        public static IMetadata With(IDictionary<string, string> keyValuePairs)
        {
            return new Metadata(keyValuePairs);
        }

        [JsonIgnore]
        public SourceId SourceId
        {
            get => GetMetadataValue(MetadataKeys.SourceId, v => new SourceId(v));
            set => Add(MetadataKeys.SourceId, value.Value);
        }

        [JsonIgnore]
        public string EventName
        {
            get => GetMetadataValue(MetadataKeys.EventName);
            set => Add(MetadataKeys.EventName, value);
        }

        [JsonIgnore]
        public uint EventVersion
        {
            get => GetMetadataValue(MetadataKeys.EventVersion, uint.Parse);
            set => Add(MetadataKeys.EventVersion, value.ToString());
        }

        [JsonIgnore]
        public DateTimeOffset Timestamp
        {
            get => GetMetadataValue(MetadataKeys.Timestamp, DateTimeOffset.Parse);
            set => Add(MetadataKeys.Timestamp, value.ToString("O"));
        }

        [JsonIgnore]
        public long TimestampEpoch =>
            TryGetValue(MetadataKeys.TimestampEpoch, out var timestampEpoch)
                ? long.Parse(timestampEpoch)
                : Timestamp.ToUnixTime();

        [JsonIgnore]
        public uint AggregateSequenceNumber
        {
            get => GetMetadataValue(MetadataKeys.AggregateSequenceNumber, uint.Parse);
            set => Add(MetadataKeys.AggregateSequenceNumber, value.ToString());
        }

        [JsonIgnore]
        public string AggregateId
        {
            get => GetMetadataValue(MetadataKeys.AggregateId);
            set => Add(MetadataKeys.AggregateId, value);
        }

        [JsonIgnore]
        public EventId EventId
        {
            get => (EventId)GetMetadataValue(MetadataKeys.EventId, EventId.With);
            set => Add(MetadataKeys.EventId, value.Value);
        }

        [JsonIgnore]
        public string AggregateName
        {
            get => GetMetadataValue(MetadataKeys.AggregateName);
            set => Add(MetadataKeys.AggregateName, value);
        }

        public Metadata()
        {
            // Empty
        }

        public Metadata(IDictionary<string, string> keyValuePairs)
            : base(keyValuePairs) { }

        public Metadata(IEnumerable<KeyValuePair<string, string>> keyValuePairs)
            : base(keyValuePairs.ToDictionary(kv => kv.Key, kv => kv.Value)) { }

        public Metadata(params KeyValuePair<string, string>[] keyValuePairs)
            : this((IEnumerable<KeyValuePair<string, string>>)keyValuePairs) { }

        public IMetadata CloneWith(params KeyValuePair<string, string>[] keyValuePairs)
        {
            return CloneWith((IEnumerable<KeyValuePair<string, string>>)keyValuePairs);
        }

        public IMetadata CloneWith(IEnumerable<KeyValuePair<string, string>> keyValuePairs)
        {
            var metadata = new Metadata(this);
            foreach (var kv in keyValuePairs)
            {
                if (metadata.ContainsKey(kv.Key))
                {
                    throw new ArgumentException($"Key '{kv.Key}' is already present!");
                }
                metadata[kv.Key] = kv.Value;
            }
            return metadata;
        }
    }
}
