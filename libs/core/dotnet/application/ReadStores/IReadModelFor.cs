using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.ReadStores
{
    public interface IReadModelFor<TAggregate, in TIdentity, in TEvent>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
        where TEvent : IAggregateEvent<TAggregate, TIdentity>
    {
        Task ApplyAsync(
            IReadModelContext context,
            IDomainEvent<TAggregate, TIdentity, TEvent> domainEvent,
            CancellationToken cancellationToken
        );
    }
}
