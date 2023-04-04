using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Application.Sagas;

namespace OpenSystem.Core.Infrastructure.Sagas
{
    public class NoSagaUpdateResilienceStrategy : ISagaUpdateResilienceStrategy
    {
        public Task BeforeUpdateAsync(
            ISaga saga,
            IDomainEvent domainEvent,
            SagaDetails details,
            CancellationToken cancellationToken
        )
        {
            return Task.CompletedTask;
        }

        public Task<bool> HandleUpdateFailedAsync(
            ISaga saga,
            IDomainEvent domainEvent,
            SagaDetails details,
            Exception exception,
            CancellationToken cancellationToken
        )
        {
            return Task.FromResult(false);
        }

        public Task UpdateSucceededAsync(
            ISaga saga,
            IDomainEvent domainEvent,
            SagaDetails details,
            CancellationToken cancellationToken
        )
        {
            return Task.CompletedTask;
        }
    }
}
