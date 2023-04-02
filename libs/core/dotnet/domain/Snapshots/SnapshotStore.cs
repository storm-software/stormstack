using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.Snapshots
{
    public class SnapshotStore : ISnapshotStore
    {
        private readonly ILogger<SnapshotStore> _logger;
        private readonly ISnapshotSerializer _snapshotSerializer;
        private readonly ISnapshotPersistence _snapshotPersistence;

        public SnapshotStore(
            ILogger<SnapshotStore> logger,
            ISnapshotSerializer snapshotSerializer,
            ISnapshotPersistence snapshotPersistence
        )
        {
            _logger = logger;
            _snapshotSerializer = snapshotSerializer;
            _snapshotPersistence = snapshotPersistence;
        }

        public async Task<SnapshotContainer> LoadSnapshotAsync<TAggregate, TIdentity, TSnapshot>(
            TIdentity identity,
            CancellationToken cancellationToken
        )
            where TAggregate : ISnapshotAggregateRoot<TIdentity, TSnapshot>
            where TIdentity : IIdentity
            where TSnapshot : ISnapshot
        {
            _logger.LogTrace(
                "Fetching snapshot for {AggregateType} with ID {Id}",
                typeof(TAggregate).PrettyPrint(),
                identity
            );
            var committedSnapshot = await _snapshotPersistence
                .GetSnapshotAsync(typeof(TAggregate), identity, cancellationToken)
                .ConfigureAwait(false);
            if (committedSnapshot == null)
            {
                _logger.LogTrace(
                    "No snapshot found for {AggregateType} with ID {Id}",
                    typeof(TAggregate).PrettyPrint(),
                    identity
                );
                return null;
            }

            var snapshotContainer = await _snapshotSerializer
                .DeserializeAsync<TAggregate, TIdentity, TSnapshot>(
                    committedSnapshot,
                    cancellationToken
                )
                .ConfigureAwait(false);

            return snapshotContainer;
        }

        public async Task StoreSnapshotAsync<TAggregate, TIdentity, TSnapshot>(
            TIdentity identity,
            SnapshotContainer snapshotContainer,
            CancellationToken cancellationToken
        )
            where TAggregate : ISnapshotAggregateRoot<TIdentity, TSnapshot>
            where TIdentity : IIdentity
            where TSnapshot : ISnapshot
        {
            var serializedSnapshot = await _snapshotSerializer
                .SerializeAsync<TAggregate, TIdentity, TSnapshot>(
                    snapshotContainer,
                    cancellationToken
                )
                .ConfigureAwait(false);

            await _snapshotPersistence
                .SetSnapshotAsync(
                    typeof(TAggregate),
                    identity,
                    serializedSnapshot,
                    cancellationToken
                )
                .ConfigureAwait(false);
        }
    }
}
