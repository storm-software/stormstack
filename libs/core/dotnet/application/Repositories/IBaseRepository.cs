using System.Linq.Expressions;
using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.Core.Application.Repositories
{
  public interface IBaseRepository<TEntity>
    where TEntity : AuditableEntity, IAggregateRoot
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

        IBaseUnitOfWork UnitOfWork { get; }

        Task<TEntity> FirstOrDefaultAsync<TDto>(TDto dto,
          CancellationToken cancellationToken = default)
          where TDto : class;
    }
}
