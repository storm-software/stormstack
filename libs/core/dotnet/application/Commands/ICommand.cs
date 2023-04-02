using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Commands
{
    public interface ICommand : IBaseRequest<IAggregateEventResult>, IVersioned
    {
        Task<IAggregateEventResult> PublishAsync(
            ICommandBus commandBus,
            CancellationToken cancellationToken
        );

        CommandId GetSourceId();
    }

    public interface ICommand<TAggregate, TIdentity> : ICommand
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
    {
        TIdentity AggregateId { get; }

        TAggregate Aggregate { get; set; }

        CommandId SourceId { get; }
    }

    public interface ICommand<TAggregate, TIdentity, TExecutionResult>
        : ICommand<TAggregate, TIdentity>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
        where TExecutionResult : IAggregateEventResult { }
}
