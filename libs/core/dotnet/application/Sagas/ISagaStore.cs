using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Sagas
{
    public interface ISagaStore
    {
        Task<TSaga> UpdateAsync<TSaga>(
            SagaId sagaId,
            SourceId sourceId,
            Func<TSaga, CancellationToken, Task> updateSaga,
            CancellationToken cancellationToken
        )
            where TSaga : ISaga;

        Task<ISaga> UpdateAsync(
            SagaId sagaId,
            Type sagaType,
            SourceId sourceId,
            Func<ISaga, CancellationToken, Task> updateSaga,
            CancellationToken cancellationToken
        );
    }
}
