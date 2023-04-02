using System.Globalization;
using System.Text.Json.Serialization;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Snapshots
{
    public class SnapshotMetadata : MetadataContainer, ISnapshotMetadata
    {
        private static readonly IReadOnlyCollection<ISourceId> Empty = new List<ISourceId>();
        private static readonly char[] SourceIdSeparators = { ',' };

        public SnapshotMetadata() { }

        public SnapshotMetadata(IDictionary<string, string> keyValuePairs)
            : base(keyValuePairs) { }

        public SnapshotMetadata(IEnumerable<KeyValuePair<string, string>> keyValuePairs)
            : base(keyValuePairs.ToDictionary(kv => kv.Key, kv => kv.Value)) { }

        public SnapshotMetadata(params KeyValuePair<string, string>[] keyValuePairs)
            : this((IEnumerable<KeyValuePair<string, string>>)keyValuePairs) { }

        [JsonIgnore]
        public string AggregateId
        {
            get => GetMetadataValue(SnapshotMetadataKeys.AggregateId);
            set => Add(SnapshotMetadataKeys.AggregateId, value);
        }

        [JsonIgnore]
        public string AggregateName
        {
            get => GetMetadataValue(SnapshotMetadataKeys.AggregateName);
            set => Add(SnapshotMetadataKeys.AggregateName, value);
        }

        [JsonIgnore]
        public ulong AggregateSequenceNumber
        {
            get => GetMetadataValue(SnapshotMetadataKeys.AggregateSequenceNumber, ulong.Parse);
            set =>
                Add(
                    SnapshotMetadataKeys.AggregateSequenceNumber,
                    value.ToString(CultureInfo.InvariantCulture)
                );
        }

        [JsonIgnore]
        public string SnapshotName
        {
            get => GetMetadataValue(SnapshotMetadataKeys.SnapshotName);
            set => Add(SnapshotMetadataKeys.SnapshotName, value);
        }

        [JsonIgnore]
        public ulong SnapshotVersion
        {
            get => GetMetadataValue(SnapshotMetadataKeys.SnapshotVersion, ulong.Parse);
            set =>
                Add(
                    SnapshotMetadataKeys.SnapshotVersion,
                    value.ToString(CultureInfo.InvariantCulture)
                );
        }

        [JsonIgnore]
        public IReadOnlyCollection<ISourceId> PreviousSourceIds
        {
            get
            {
                if (
                    !TryGetValue(SnapshotMetadataKeys.PreviousSourceIds, out var ids)
                    || string.IsNullOrEmpty(ids)
                )
                {
                    return Empty;
                }

                return ids.Split(SourceIdSeparators, StringSplitOptions.RemoveEmptyEntries)
                    .Select(sourceId => new SourceId(sourceId))
                    .ToArray();
            }
            set =>
                Add(
                    SnapshotMetadataKeys.PreviousSourceIds,
                    string.Join(",", value.Select(x => x.Value))
                );
        }
    }
}
