using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ResultCodes;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.Core.Domain.Aggregates
{
    public class NoAggregateStoreResilienceStrategy : IAggregateStoreResilienceStrategy
    {
        public Task BeforeAggregateUpdate<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult
        {
            return Task.CompletedTask;
        }

        public Task BeforeCommitAsync<TAggregate, TIdentity, TExecutionResult>(
            TAggregate aggregate,
            TExecutionResult executionResult,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult
        {
            return Task.CompletedTask;
        }

        public Task<(bool, IAggregateEventResult)> HandleCommitFailedAsync<
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
            where TExecutionResult : IAggregateEventResult
        {
            return Task.FromResult<(bool, IAggregateEventResult)>((false, null));
        }

        public Task CommitSucceededAsync<TAggregate, TIdentity, TExecutionResult>(
            TAggregate aggregate,
            TExecutionResult executionResult,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult
        {
            return Task.CompletedTask;
        }

        public Task EventPublishSkippedAsync<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            TExecutionResult executionResult,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult
        {
            return Task.CompletedTask;
        }

        public Task BeforeEventPublishAsync<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            TExecutionResult executionResult,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult
        {
            return Task.CompletedTask;
        }

        public Task<bool> HandleEventPublishFailedAsync<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            TExecutionResult executionResult,
            Exception exception,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult
        {
            return Task.FromResult(false);
        }

        public Task EventPublishSucceededAsync<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            TExecutionResult executionResult,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult
        {
            return Task.CompletedTask;
        }
    }
}
