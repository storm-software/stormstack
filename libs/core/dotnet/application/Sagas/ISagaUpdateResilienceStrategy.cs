using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Sagas
{
    public interface ISagaUpdateResilienceStrategy
    {
        Task BeforeUpdateAsync(
            ISaga saga,
            IDomainEvent domainEvent,
            SagaDetails details,
            CancellationToken cancellationToken
        );

        Task<bool> HandleUpdateFailedAsync(
            ISaga saga,
            IDomainEvent domainEvent,
            SagaDetails details,
            Exception exception,
            CancellationToken cancellationToken
        );

        Task UpdateSucceededAsync(
            ISaga saga,
            IDomainEvent domainEvent,
            SagaDetails details,
            CancellationToken cancellationToken
        );
    }
}
