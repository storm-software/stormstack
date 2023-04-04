using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Sagas
{
    public interface ISagaStore
    {
        Task<TSaga> UpdateAsync<TSaga>(
            SagaId sagaId,
            ISourceId sourceId,
            Func<TSaga, CancellationToken, Task> updateSaga,
            CancellationToken cancellationToken
        )
            where TSaga : ISaga;

        Task<ISaga> UpdateAsync(
            SagaId sagaId,
            Type sagaType,
            ISourceId sourceId,
            Func<ISaga, CancellationToken, Task> updateSaga,
            CancellationToken cancellationToken
        );
    }
}
