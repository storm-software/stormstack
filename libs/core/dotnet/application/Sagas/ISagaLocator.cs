using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Sagas
{
    public interface ISagaLocator
    {
        Task<SagaId> LocateSagaAsync(IDomainEvent domainEvent, CancellationToken cancellationToken);
    }
}
