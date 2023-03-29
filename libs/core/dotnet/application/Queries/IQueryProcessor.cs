using OpenSystem.Core.Application.Models;

namespace OpenSystem.Core.Application.Queries
{
    public interface IQueryProcessor
    {
        Task<TResult> ProcessAsync<TResult>(
            IQuery<TResult> query,
            CancellationToken cancellationToken
        );
    }
}
