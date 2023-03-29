using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.Aggregates
{
    public interface IAggregateFactory
    {
        Task<TAggregate> CreateNewAggregateAsync<TAggregate, TIdentity>(TIdentity id)
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;
    }
}
