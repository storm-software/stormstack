namespace OpenSystem.Core.Application.ReadStores
{
    public interface IReadModelFactory<TReadModel>
        where TReadModel : IReadModel
    {
        Task<TReadModel> CreateAsync(string id, CancellationToken cancellationToken);
    }
}
