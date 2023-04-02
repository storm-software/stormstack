using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Sagas
{
    public abstract class SagaStore : ISagaStore
    {
        public async Task<TSaga> UpdateAsync<TSaga>(
            SagaId sagaId,
            ISourceId sourceId,
            Func<TSaga, CancellationToken, Task> updateSaga,
            CancellationToken cancellationToken
        )
            where TSaga : ISaga
        {
            return (TSaga)
                await UpdateAsync(
                        sagaId,
                        typeof(TSaga),
                        sourceId,
                        (s, c) => updateSaga((TSaga)s, c),
                        cancellationToken
                    )
                    .ConfigureAwait(false);
        }

        public abstract Task<ISaga> UpdateAsync(
            SagaId sagaId,
            Type sagaType,
            ISourceId sourceId,
            Func<ISaga, CancellationToken, Task> updateSaga,
            CancellationToken cancellationToken
        );
    }
}
