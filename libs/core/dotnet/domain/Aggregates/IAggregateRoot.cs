using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Aggregates
{
    public interface IAggregateRoot : IVersioned
    {
        IEnumerable<IUncommittedEvent> UncommittedEvents { get; }

        IEnumerable<SourceId> PreviousSourceIds { get; }

        bool IsNew { get; }

        Task<IReadOnlyCollection<IDomainEvent>> CommitAsync(
            IEventStore eventStore,
            //ISnapshotStore snapshotStore,
            SourceId sourceId,
            CancellationToken cancellationToken
        );

        bool HasSourceId(SourceId sourceId);

        void ApplyEvents(IReadOnlyCollection<IDomainEvent> domainEvents);

        IIndexed GetIdentity();

        Task LoadAsync(
            IEventStore eventStore,
            //ISnapshotStore snapshotStore,
            CancellationToken cancellationToken
        );
    }

    public interface IAggregateRoot<out TIdentity> : IAggregateRoot
        where TIdentity : IIdentity
    {
        TIdentity Id { get; }
    }
}
