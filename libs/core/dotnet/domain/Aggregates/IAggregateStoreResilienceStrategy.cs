using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.Aggregates
{
    public interface IAggregateStoreResilienceStrategy
    {
        Task BeforeAggregateUpdate<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult;

        Task BeforeCommitAsync<TAggregate, TIdentity, TExecutionResult>(
            TAggregate aggregate,
            TExecutionResult executionResult,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult;

        Task<(bool, IAggregateEventResult)> HandleCommitFailedAsync<
            TAggregate,
            TIdentity,
            TExecutionResult
        >(
            TAggregate aggregate,
            TExecutionResult executionResult,
            Exception exception,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult;

        Task CommitSucceededAsync<TAggregate, TIdentity, TExecutionResult>(
            TAggregate aggregate,
            TExecutionResult executionResult,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult;

        Task EventPublishSkippedAsync<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            TExecutionResult executionResult,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult;

        Task BeforeEventPublishAsync<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            TExecutionResult executionResult,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult;

        Task<bool> HandleEventPublishFailedAsync<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            TExecutionResult executionResult,
            Exception exception,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult;

        Task EventPublishSucceededAsync<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            TExecutionResult executionResult,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult;
    }
}
