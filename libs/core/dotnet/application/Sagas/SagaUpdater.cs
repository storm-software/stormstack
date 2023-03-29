using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Sagas
{
    public class SagaUpdater<TAggregate, TIdentity, TAggregateEvent, TSaga>
        : ISagaUpdater<TAggregate, TIdentity, TAggregateEvent, TSaga>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
        where TAggregateEvent : IAggregateEvent<TAggregate, TIdentity>
        where TSaga : ISaga
    {
        public Task ProcessAsync(
            ISaga saga,
            IDomainEvent domainEvent,
            ISagaContext sagaContext,
            CancellationToken cancellationToken
        )
        {
            var specificDomainEvent =
                domainEvent as IDomainEvent<TAggregate, TIdentity, TAggregateEvent>;
            var specificSaga = saga as ISagaHandles<TAggregate, TIdentity, TAggregateEvent>;

            if (specificDomainEvent == null)
                throw new ArgumentException(
                    $"Domain event is not of type '{typeof(IDomainEvent<TAggregate, TIdentity, TAggregateEvent>).PrettyPrint()}'"
                );
            if (specificSaga == null)
                throw new ArgumentException(
                    $"Saga is not of type '{typeof(ISagaHandles<TAggregate, TIdentity, TAggregateEvent>).PrettyPrint()}'"
                );

            return specificSaga.HandleAsync(specificDomainEvent, sagaContext, cancellationToken);
        }
    }
}
