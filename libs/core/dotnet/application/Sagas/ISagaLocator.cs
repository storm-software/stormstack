using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Sagas
{
    public interface ISagaLocator
    {
        Task<SagaId> LocateSagaAsync(IDomainEvent domainEvent, CancellationToken cancellationToken);
    }
}
