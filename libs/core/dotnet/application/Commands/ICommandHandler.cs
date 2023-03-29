using MediatR;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Application.Commands
{
    public interface ICommandHandler<TAggregate, TIdentity, TCommand>
        : IRequestHandler<TCommand, IAggregateEventResult>
        where TCommand : ICommand<TAggregate, TIdentity>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity { }
}
