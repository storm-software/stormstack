using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Core.Application.Queries
{
    public interface IQueryProcessor
    {
        Task<object?> ProcessAsync(object query, CancellationToken cancellationToken);
    }
}
