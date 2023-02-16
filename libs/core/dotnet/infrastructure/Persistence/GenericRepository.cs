using OpenSystem.Core.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using OpenSystem.Core.Domain.Entities;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public class GenericRepository<TEntity>
      : IGenericRepository<TEntity>
      where TEntity : Entity<Guid>, IAggregateRoot
    {
        protected readonly ApplicationDbContext DbContext;

        public GenericRepository(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public virtual async Task<TEntity> GetByIdAsync(Guid guid)
        {
            return await DbContext.Set<TEntity>().FindAsync(guid);
        }

        public async Task<IEnumerable<TEntity>> GetPagedResponseAsync(int pageNumber,
          int pageSize)
        {
            return await DbContext
              .Set<TEntity>()
              .Skip((pageNumber - 1) * pageSize)
              .Take(pageSize)
              .AsNoTracking()
              .ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> GetPagedAdvancedResponseAsync(int pageNumber,
          int pageSize,
          string orderBy,
          string fields)
        {
            return await DbContext
              .Set<TEntity>()
              .Skip((pageNumber - 1) * pageSize)
              .Take(pageSize)
              .Select<TEntity>("new(" + fields + ")")
              .OrderBy(orderBy)
              .AsNoTracking()
              .ToListAsync();
        }

        public async Task<TEntity> AddOrUpdateAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
            if (entity.Id.Equals(default))
                await AddAsync(entity,
                  cancellationToken);
            else
                await UpdateAsync(entity,
                  cancellationToken);

            return entity;
        }

        public async Task<TEntity> AddAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
            DbContext.Entry(entity).State = EntityState.Added;

            await DbContext.Set<TEntity>().AddAsync(entity,
              cancellationToken);
            await DbContext.SaveChangesAsync(cancellationToken);

            return entity;
        }

        public async Task UpdateAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
            DbContext.Entry(entity).State = EntityState.Modified;
            await DbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
            DbContext.Set<TEntity>().Remove(entity);
            await DbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await DbContext
              .Set<TEntity>()
              .ToListAsync();
        }
    }
}
