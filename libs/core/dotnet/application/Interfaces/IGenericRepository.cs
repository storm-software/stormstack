using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.Core.Application.Interfaces
{
  public interface IGenericRepository<TEntity>
    where TEntity : Entity<Guid>, IAggregateRoot
    {
        Task<TEntity> GetByIdAsync(Guid id);

        IQueryable<TEntity> GetQueryable(bool noTracking = false);

        IQueryable<TEntity> GetQueryable(int? pageNumber,
          int? pageSize,
          string? orderBy,
          string? fields);

        Task<IEnumerable<TEntity>> GetAllAsync(int? pageNumber,
          int? pageSize,
          string? orderBy,
          string? fields);

        Task<TEntity> AddOrUpdateAsync(TEntity entity,
          CancellationToken cancellationToken = default);

        Task<TEntity> AddAsync(TEntity entity,
          CancellationToken cancellationToken = default);

        Task UpdateAsync(TEntity entity,
          CancellationToken cancellationToken = default);

        Task DeleteAsync(TEntity entity,
          CancellationToken cancellationToken = default);
    }
}
