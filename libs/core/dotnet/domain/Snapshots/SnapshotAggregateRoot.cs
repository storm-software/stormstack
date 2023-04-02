using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.Snapshots
{
    public abstract class SnapshotAggregateRoot<TAggregate, TIdentity, TSnapshot>
        : AggregateRoot<TAggregate, TIdentity>,
            ISnapshotAggregateRoot<TIdentity, TSnapshot>
        where TAggregate : SnapshotAggregateRoot<TAggregate, TIdentity, TSnapshot>
        where TIdentity : IIdentity
        where TSnapshot : ISnapshot
    {
        protected ISnapshotStrategy SnapshotStrategy { get; }

        protected SnapshotAggregateRoot(TIdentity id, ISnapshotStrategy snapshotStrategy)
            : base(id)
        {
            SnapshotStrategy = snapshotStrategy;
        }

        public ulong? SnapshotVersion { get; private set; }

        public override async Task LoadAsync(
            IEventStore eventStore,
            ISnapshotStore snapshotStore,
            CancellationToken cancellationToken
        )
        {
            var snapshot = await snapshotStore
                .LoadSnapshotAsync<TAggregate, TIdentity, TSnapshot>(Id, cancellationToken)
                .ConfigureAwait(false);
            if (snapshot == null)
            {
                await base.LoadAsync(eventStore, snapshotStore, cancellationToken)
                    .ConfigureAwait(false);
                return;
            }

            await LoadSnapshotContainerAsync(snapshot, cancellationToken).ConfigureAwait(false);

            Version = snapshot.Metadata.AggregateSequenceNumber;
            AddPreviousSourceIds(snapshot.Metadata.PreviousSourceIds);
            var domainEvents = await eventStore
                .LoadEventsAsync<TAggregate, TIdentity>(Id, Version + 1, cancellationToken)
                .ConfigureAwait(false);

            ApplyEvents(domainEvents);
        }

        public override async Task<IReadOnlyCollection<IDomainEvent>> CommitAsync(
            IEventStore eventStore,
            ISnapshotStore snapshotStore,
            ISourceId sourceId,
            CancellationToken cancellationToken
        )
        {
            var domainEvents = await base.CommitAsync(
                eventStore,
                snapshotStore,
                sourceId,
                cancellationToken
            )
                .ConfigureAwait(false);

            if (
                !await SnapshotStrategy
                    .ShouldCreateSnapshotAsync(this, cancellationToken)
                    .ConfigureAwait(false)
            )
                return domainEvents;

            var snapshotContainer = await CreateSnapshotContainerAsync(sourceId, cancellationToken)
                .ConfigureAwait(false);
            await snapshotStore
                .StoreSnapshotAsync<TAggregate, TIdentity, TSnapshot>(
                    Id,
                    snapshotContainer,
                    cancellationToken
                )
                .ConfigureAwait(false);

            return domainEvents;
        }

        private async Task<SnapshotContainer> CreateSnapshotContainerAsync(
            ISourceId sourceId,
            CancellationToken cancellationToken
        )
        {
            var snapshotTask = CreateSnapshotAsync(cancellationToken);
            var snapshotMetadataTask = CreateSnapshotMetadataAsync(sourceId, cancellationToken);

            await Task.WhenAll(snapshotTask, snapshotMetadataTask).ConfigureAwait(false);

            var snapshotContainer = new SnapshotContainer(
                snapshotTask.Result,
                snapshotMetadataTask.Result
            );

            return snapshotContainer;
        }

        private Task LoadSnapshotContainerAsync(
            SnapshotContainer snapshotContainer,
            CancellationToken cancellationToken
        )
        {
            if (SnapshotVersion.HasValue)
            {
                throw new InvalidOperationException(
                    $"Aggregate '{Id}' of type '{GetType().PrettyPrint()}' already has snapshot loaded"
                );
            }

            if (Version > 0)
            {
                throw new InvalidOperationException(
                    $"Aggregate '{Id}' of type '{GetType().PrettyPrint()}' already has events loaded"
                );
            }

            if (!(snapshotContainer.Snapshot is TSnapshot snapshot))
            {
                throw new ArgumentException(
                    $"Snapshot '{snapshotContainer.Snapshot.GetType().PrettyPrint()}' for aggregate '{GetType().PrettyPrint()}' is not of type '{typeof(TSnapshot).PrettyPrint()}'. Did you forget to implement a snapshot upgrader?"
                );
            }

            SnapshotVersion = snapshotContainer.Metadata.AggregateSequenceNumber;

            AddPreviousSourceIds(snapshotContainer.Metadata.PreviousSourceIds);

            return LoadSnapshotAsync(snapshot, snapshotContainer.Metadata, cancellationToken);
        }

        protected abstract Task<TSnapshot> CreateSnapshotAsync(CancellationToken cancellationToken);

        protected abstract Task LoadSnapshotAsync(
            TSnapshot snapshot,
            ISnapshotMetadata metadata,
            CancellationToken cancellationToken
        );

        protected virtual Task<ISnapshotMetadata> CreateSnapshotMetadataAsync(
            ISourceId sourceId,
            CancellationToken cancellationToken
        )
        {
            // We need to append the current source ID that triggered the snapshot
            // as this hasn't been loaded via the event stream
            var sourceIds = PreviousSourceIds.Append(sourceId).ToArray();

            var snapshotMetadata = (ISnapshotMetadata)
                new SnapshotMetadata
                {
                    AggregateId = Id.Value,
                    AggregateName = Name.Value,
                    AggregateSequenceNumber = Version,
                    PreviousSourceIds = sourceIds
                };

            return Task.FromResult(snapshotMetadata);
        }
    }
}
