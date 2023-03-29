using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Sagas
{
    public interface IAggregateSaga<out TIdentity, TLocator>
        : ISaga<TLocator>,
            IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
        where TLocator : ISagaLocator { }
}
