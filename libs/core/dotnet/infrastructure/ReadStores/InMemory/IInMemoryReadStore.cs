using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Core.Infrastructure.ReadStores.InMemory
{
    public interface IInMemoryReadStore<TReadModel> : IReadModelStore<TReadModel>
        where TReadModel : class, IReadModel
    {
        Task<IReadOnlyCollection<TReadModel>> FindAsync(
            Predicate<TReadModel> predicate,
            CancellationToken cancellationToken
        );
    }
}
