using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Aggregates
{
    public interface IAggregateStore
    {
        Task<TAggregate> LoadAsync<TAggregate, TIdentity>(
            TIdentity id,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;

        Task<IAggregateEventResult> UpdateAsync<TAggregate, TIdentity>(
            TIdentity id,
            SourceId sourceId,
            Func<TAggregate, CancellationToken, Task> updateAggregate,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;

        Task<IAggregateEventResult> UpdateAsync<TAggregate, TIdentity, TExecutionResult>(
            TIdentity id,
            SourceId sourceId,
            Func<TAggregate, CancellationToken, Task<TExecutionResult>> updateAggregate,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TExecutionResult : IAggregateEventResult;

        Task<IAggregateEventResult> StoreAsync<TAggregate, TIdentity>(
            TAggregate aggregate,
            SourceId sourceId,
            CancellationToken cancellationToken
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity;
    }
}
