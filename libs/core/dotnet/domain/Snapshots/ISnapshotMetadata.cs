using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.Snapshots
{
    public interface ISnapshotMetadata : IMetadataContainer
    {
        string SnapshotName { get; }

        ulong SnapshotVersion { get; }

        ulong AggregateSequenceNumber { get; }

        string AggregateId { get; }

        string AggregateName { get; }

        IReadOnlyCollection<ISourceId> PreviousSourceIds { get; }
    }
}
