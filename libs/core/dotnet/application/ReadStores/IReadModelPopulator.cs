namespace OpenSystem.Core.Application.ReadStores
{
    public interface IReadModelPopulator
    {
        Task PurgeAsync<TReadModel>(CancellationToken cancellationToken)
            where TReadModel : class, IReadModel;

        Task PopulateAsync<TReadModel>(CancellationToken cancellationToken)
            where TReadModel : class, IReadModel;

        Task PopulateAsync(Type readModelType, CancellationToken cancellationToken);

        Task PurgeAsync(Type readModelType, CancellationToken cancellationToken);

        Task DeleteAsync(string id, Type readModelType, CancellationToken cancellationToken);
    }
}
