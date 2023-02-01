namespace OpenSystem.Core.Domain.Events
{
    public interface IDomainEventList
    {
        Task DispatchAsync(IDomainEvent domainEvent,
          CancellationToken cancellationToken = default);
    }
}
