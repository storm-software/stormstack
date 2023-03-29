using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Sagas
{
    public interface IDispatchToSagas
    {
        Task ProcessAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );
    }
}
