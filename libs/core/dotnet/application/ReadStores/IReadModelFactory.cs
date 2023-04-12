using Microsoft.Extensions.Logging;

namespace OpenSystem.Core.Application.ReadStores
{
    public interface IReadModelFactory<TReadModel>
        where TReadModel : IReadModel
    {
        Task<TReadModel> CreateAsync(string id, CancellationToken cancellationToken);

        void SetLogger(ILogger<ReadModelFactory<TReadModel>> logger);
    }
}
