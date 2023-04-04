using OpenSystem.Core.Application.Commands;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;
using OpenSystem.Core.Application.Sagas;

namespace OpenSystem.Core.Infrastructure.Sagas
{
    public abstract class AggregateSaga<TSaga, TIdentity, TLocator>
        : AggregateRoot<TSaga, TIdentity>,
            IAggregateSaga<TIdentity, TLocator>
        where TSaga : AggregateSaga<TSaga, TIdentity, TLocator>
        where TIdentity : SagaId
        where TLocator : ISagaLocator
    {
        private readonly ICollection<
            Tuple<ICommand, Func<ICommandBus, CancellationToken, Task<IAggregateEventResult>>>
        > _unpublishedCommands =
            new List<
                Tuple<ICommand, Func<ICommandBus, CancellationToken, Task<IAggregateEventResult>>>
            >();

        private bool _isCompleted;

        protected virtual bool ThrowExceptionsOnFailedPublish { get; set; } = true;

        protected AggregateSaga(TIdentity id)
            : base(id) { }

        protected void Complete()
        {
            _isCompleted = true;
        }

        protected void Publish<TCommandAggregate, TCommandAggregateIdentity, TExecutionResult>(
            ICommand<TCommandAggregate, TCommandAggregateIdentity, TExecutionResult> command
        )
            where TCommandAggregate : IAggregateRoot<TCommandAggregateIdentity>
            where TCommandAggregateIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult
        {
            _unpublishedCommands.Add(
                new Tuple<
                    ICommand,
                    Func<ICommandBus, CancellationToken, Task<IAggregateEventResult>>
                >(command, async (b, c) => await b.PublishAsync(command, c).ConfigureAwait(false))
            );
        }

        public SagaStateTypes State =>
            _isCompleted
                ? SagaStateTypes.Completed
                : IsNew
                    ? SagaStateTypes.New
                    : SagaStateTypes.Running;

        public virtual async Task PublishAsync(
            ICommandBus commandBus,
            CancellationToken cancellationToken
        )
        {
            var commandsToPublish = _unpublishedCommands.ToList();
            _unpublishedCommands.Clear();

            var exceptions = new List<Exception>();
            foreach (var unpublishedCommand in commandsToPublish)
            {
                var command = unpublishedCommand.Item1;
                var commandInvoker = unpublishedCommand.Item2;
                if (ThrowExceptionsOnFailedPublish)
                {
                    try
                    {
                        var executionResult = await commandInvoker(commandBus, cancellationToken)
                            .ConfigureAwait(false);
                        if (executionResult?.Succeeded == false)
                            exceptions.Add(
                                new GeneralProcessingException(
                                    $"Command '{command.GetType().PrettyPrint()}' with ID '{command.GetSourceId()}' published from a saga with ID '{Id}' failed with: '{executionResult}'. See ExecutionResult."
                                )
                            );
                    }
                    catch (Exception e)
                    {
                        exceptions.Add(
                            new GeneralProcessingException(
                                $"Command '{command.GetType().PrettyPrint()}' with ID '{command.GetSourceId()}' published from a saga with ID '{Id}' failed with: '{e.Message}'. See InnerException.",
                                e
                            )
                        );
                    }
                }
                else
                    await commandInvoker(commandBus, cancellationToken).ConfigureAwait(false);
            }

            if (exceptions.Count > 0)
                throw new GeneralProcessingException(
                    $"Some commands published from a saga with ID '{Id}' failed. See InnerExceptions.",
                    exceptions.First()
                );
        }
    }
}
