using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Repositories
{
    public interface IBaseReadOnlyRepository<TEntity>
        where TEntity : AggregateRoot
    {
        IQueryable<TEntity> GetQueryable();

        IQueryable<TEntity> GetQueryable(
            int? pageNumber,
            int? pageSize,
            string? orderBy,
            string? fields
        );

        Task<IList<TEntity>> GetAllAsync(
            int? pageNumber,
            int? pageSize,
            string? orderBy,
            string? fields
        );

        Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
