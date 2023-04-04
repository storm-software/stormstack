using OpenSystem.Core.Domain.ValueObjects;
using OpenSystem.Core.Application.Sagas;

namespace OpenSystem.Core.Infrastructure.Sagas
{
    public class SagaErrorHandler : ISagaErrorHandler
    {
        public Task<bool> HandleAsync(
            SagaId sagaId,
            SagaDetails sagaDetails,
            Exception exception,
            CancellationToken cancellationToken
        )
        {
            // The default handler cannot handle anything!
            return Task.FromResult(false);
        }
    }
}
