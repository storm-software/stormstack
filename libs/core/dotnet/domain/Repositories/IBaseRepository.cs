using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Repositories
{
    public interface IBaseRepository<TEntity>
        where TEntity : AggregateRoot
    {
        IBaseUnitOfWork UnitOfWork { get; }

        IQueryable<TEntity> GetQueryable(bool noTracking = false);

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

        Task<TEntity> AddOrUpdateAsync<TDto>(
            TDto dto,
            CancellationToken cancellationToken = default
        )
            where TDto : class;

        Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);

        Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);

        Task<TEntity> DeleteAsync<TDto>(TDto dto, CancellationToken cancellationToken = default)
            where TDto : class;

        Task<TEntity> RestoreAsync<TDto>(TDto dto, CancellationToken cancellationToken = default)
            where TDto : class;
    }
}
