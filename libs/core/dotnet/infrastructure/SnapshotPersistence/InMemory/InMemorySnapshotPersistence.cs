using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Snapshots;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Infrastructure.SnapshotPersistence.InMemory
{
    public class InMemorySnapshotPersistence : ISnapshotPersistence
    {
        private readonly ILogger<InMemorySnapshotPersistence> _logger;

        private readonly AsyncLock _asyncLock = new AsyncLock();

        private readonly Dictionary<Type, Dictionary<string, CommittedSnapshot>> _snapshots =
            new Dictionary<Type, Dictionary<string, CommittedSnapshot>>();

        public InMemorySnapshotPersistence(ILogger<InMemorySnapshotPersistence> logger)
        {
            _logger = logger;
        }

        public async Task<CommittedSnapshot> GetSnapshotAsync(
            Type aggregateType,
            IIdentity identity,
            CancellationToken cancellationToken
        )
        {
            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                if (!_snapshots.TryGetValue(aggregateType, out var snapshots))
                {
                    return null;
                }

                return snapshots.TryGetValue(identity.Value, out var committedSnapshot)
                    ? committedSnapshot
                    : null;
            }
        }

        public async Task SetSnapshotAsync(
            Type aggregateType,
            IIdentity identity,
            SerializedSnapshot serializedSnapshot,
            CancellationToken cancellationToken
        )
        {
            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                _logger.LogTrace(
                    "Setting snapshot {AggregateType} with ID {Id}",
                    aggregateType.PrettyPrint(),
                    identity.Value
                );

                if (!_snapshots.TryGetValue(aggregateType, out var snapshots))
                {
                    snapshots = new Dictionary<string, CommittedSnapshot>();
                    _snapshots[aggregateType] = snapshots;
                }

                snapshots[identity.Value] = serializedSnapshot;
            }
        }

        public async Task DeleteSnapshotAsync(
            Type aggregateType,
            IIdentity identity,
            CancellationToken cancellationToken
        )
        {
            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                _logger.LogTrace(
                    "Deleting snapshot {AggregateType} with ID {Id}",
                    aggregateType.PrettyPrint(),
                    identity.Value
                );

                if (!_snapshots.TryGetValue(aggregateType, out var snapshots))
                {
                    return;
                }

                snapshots.Remove(identity.Value);
            }
        }

        public async Task PurgeSnapshotsAsync(
            Type aggregateType,
            CancellationToken cancellationToken
        )
        {
            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                _logger.LogWarning(
                    "Purging ALL snapshots of type {AggregateType}!",
                    aggregateType.PrettyPrint()
                );

                _snapshots.Remove(aggregateType);
            }
        }

        public async Task PurgeSnapshotsAsync(CancellationToken cancellationToken)
        {
            using (await _asyncLock.WaitAsync(cancellationToken).ConfigureAwait(false))
            {
                _logger.LogWarning("Purging ALL snapshots!");

                _snapshots.Clear();
            }
        }
    }
}
