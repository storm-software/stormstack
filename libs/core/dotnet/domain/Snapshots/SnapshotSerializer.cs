using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.Snapshots
{
    public class SnapshotSerializer : ISnapshotSerializer
    {
        private readonly ILogger<SnapshotSerializer> _logger;
        private readonly IJsonSerializer _jsonSerializer;
        private readonly ISnapshotUpgradeService _snapshotUpgradeService;
        private readonly ISnapshotDefinitionService _snapshotDefinitionService;

        public SnapshotSerializer(
            ILogger<SnapshotSerializer> logger,
            IJsonSerializer jsonSerializer,
            ISnapshotUpgradeService snapshotUpgradeService,
            ISnapshotDefinitionService snapshotDefinitionService
        )
        {
            _logger = logger;
            _jsonSerializer = jsonSerializer;
            _snapshotUpgradeService = snapshotUpgradeService;
            _snapshotDefinitionService = snapshotDefinitionService;
        }

        public Task<SerializedSnapshot> SerializeAsync<TAggregate, TIdentity, TSnapshot>(
            SnapshotContainer snapshotContainer,
            CancellationToken cancellationToken
        )
            where TAggregate : ISnapshotAggregateRoot<TIdentity, TSnapshot>
            where TIdentity : IIdentity
            where TSnapshot : ISnapshot
        {
            var snapshotDefinition = _snapshotDefinitionService.GetDefinition(typeof(TSnapshot));

            _logger.LogTrace(
                "Building snapshot {SnapshotName} v{SnapshotVersion} for {AggregateType}",
                snapshotDefinition.Name,
                snapshotDefinition.Version,
                typeof(TAggregate).PrettyPrint()
            );

            var updatedSnapshotMetadata = new SnapshotMetadata(
                snapshotContainer.Metadata.Concat(
                    new Dictionary<string, string>
                    {
                        { SnapshotMetadataKeys.SnapshotName, snapshotDefinition.Name },
                        {
                            SnapshotMetadataKeys.SnapshotVersion,
                            snapshotDefinition.Version.ToString()
                        },
                    }
                )
            );

            var serializedMetadata = _jsonSerializer.Serialize(updatedSnapshotMetadata);
            var serializedData = _jsonSerializer.Serialize(snapshotContainer.Snapshot);

            return Task.FromResult(
                new SerializedSnapshot(serializedMetadata, serializedData, updatedSnapshotMetadata)
            );
        }

        public async Task<SnapshotContainer> DeserializeAsync<TAggregate, TIdentity, TSnapshot>(
            CommittedSnapshot committedSnapshot,
            CancellationToken cancellationToken
        )
            where TAggregate : ISnapshotAggregateRoot<TIdentity, TSnapshot>
            where TIdentity : IIdentity
            where TSnapshot : ISnapshot
        {
            if (committedSnapshot == null)
                throw new ArgumentNullException(nameof(committedSnapshot));

            var metadata = _jsonSerializer.Deserialize<SnapshotMetadata>(
                committedSnapshot.SerializedMetadata
            );
            var snapshotDefinition = _snapshotDefinitionService.GetDefinition(
                metadata.SnapshotName,
                metadata.SnapshotVersion
            );

            _logger.LogTrace(
                "Deserializing snapshot named {SnapshotName} v{SnapshotVersion} for '{AggregateType}' v{AggregateVersion}",
                snapshotDefinition.Name,
                snapshotDefinition.Version,
                typeof(TAggregate).PrettyPrint(),
                metadata.AggregateSequenceNumber
            );

            var snapshot = (ISnapshot)
                _jsonSerializer.Deserialize(
                    committedSnapshot.SerializedData,
                    snapshotDefinition.Type
                );
            var upgradedSnapshot = await _snapshotUpgradeService
                .UpgradeAsync(snapshot, cancellationToken)
                .ConfigureAwait(false);

            return new SnapshotContainer(upgradedSnapshot, metadata);
        }
    }
}
