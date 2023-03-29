using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.ReadStores
{
    public interface IReadStoreManager
    {
        Type ReadModelType { get; }

        Task UpdateReadStoresAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        );
    }

    public interface IReadStoreManager<TReadModel> : IReadStoreManager
        where TReadModel : class, IReadModel { }
}
