using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Sagas
{
    public interface ISagaUpdater
    {
        Task ProcessAsync(
            ISaga saga,
            IDomainEvent domainEvent,
            ISagaContext sagaContext,
            CancellationToken cancellationToken
        );
    }

    public interface ISagaUpdater<TAggregate, TIdentity, TAggregateEvent, TSaga> : ISagaUpdater
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
        where TAggregateEvent : IAggregateEvent<TAggregate, TIdentity>
        where TSaga : ISaga { }
}
