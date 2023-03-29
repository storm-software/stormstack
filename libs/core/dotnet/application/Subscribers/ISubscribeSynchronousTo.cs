using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Application.Subscribers
{
    public interface ISubscribeSynchronousTo<TAggregate, in TIdentity, in TEvent> : ISubscribe
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
        where TEvent : IAggregateEvent<TAggregate, TIdentity>
    {
        Task HandleAsync(
            IDomainEvent<TAggregate, TIdentity, TEvent> domainEvent,
            CancellationToken cancellationToken
        );
    }
}
