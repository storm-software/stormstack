using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Publishers
{
    public interface IDispatchToSagas
    {
        Task ProcessAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );
    }
}
