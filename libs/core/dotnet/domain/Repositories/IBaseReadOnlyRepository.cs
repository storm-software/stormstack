using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Repositories
{
    public interface IBaseReadOnlyRepository<TEntity, TEntityId>
        where TEntity : Entity<TEntityId>
        where TEntityId : EntityId
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

        Task<TEntity?> GetByIdAsync(TEntityId id, CancellationToken cancellationToken = default);
    }
}
