using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Snapshots;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Aggregates
{
    public interface IAggregateRoot : IVersioned
    {
        IAggregateName Name { get; }

        IEnumerable<IUncommittedEvent> UncommittedEvents { get; }

        IEnumerable<ISourceId> PreviousSourceIds { get; }

        bool IsNew { get; }

        Task<IReadOnlyCollection<IDomainEvent>> CommitAsync(
            IEventStore eventStore,
            ISnapshotStore snapshotStore,
            ISourceId sourceId,
            CancellationToken cancellationToken
        );

        bool HasSourceId(ISourceId sourceId);

        void ApplyEvents(IReadOnlyCollection<IDomainEvent> domainEvents);

        IIdentity GetIdentity();

        Task LoadAsync(
            IEventStore eventStore,
            ISnapshotStore snapshotStore,
            CancellationToken cancellationToken
        );

        ValueTask<IAggregateEventResult> ValidateAsync(IDomainEvent @event);
    }

    public interface IAggregateRoot<out TIdentity> : IAggregateRoot
        where TIdentity : IIdentity
    {
        TIdentity Id { get; }
    }
}
