using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Commands
{
    public interface ICommandBus
    {
        Task<IAggregateEventResult> PublishAsync<TAggregate, TIdentity>(
            ICommand<TAggregate, TIdentity> command,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;
    }
}
