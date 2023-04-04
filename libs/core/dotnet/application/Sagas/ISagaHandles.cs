using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Sagas
{
    public interface ISagaHandles<TAggregate, in TIdentity, in TAggregateEvent> : ISaga
        where TAggregateEvent : IAggregateEvent<TAggregate, TIdentity>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
    {
        Task HandleAsync(
            IDomainEvent<TAggregate, TIdentity, TAggregateEvent> domainEvent,
            ISagaContext sagaContext,
            CancellationToken cancellationToken
        );
    }
}
