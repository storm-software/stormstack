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

        protected DbSet<TEntity> DbSet => DbContext.Set<TEntity>();

        public GenericRepository(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public virtual async Task<TEntity> GetByIdAsync(Guid guid)
        {
            return await DbSet.FindAsync(guid);
        }

        public async Task<IEnumerable<TEntity>> GetPagedResponseAsync(int pageNumber,
          int pageSize)
        {
            return await DbSet
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
            return await DbSet
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
            await DbSet.AddAsync(entity,
              cancellationToken);

            entity = await InnerAddAsync(entity,
              cancellationToken);

            await DbContext.SaveChangesAsync(cancellationToken);

            return entity;
        }

        public async Task UpdateAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
            DbContext.Entry(entity).State = EntityState.Modified;

            await InnerDeleteAsync(entity,
              cancellationToken);

            await DbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
            DbSet.Remove(entity);

            await InnerDeleteAsync(entity,
              cancellationToken);

            await DbContext.SaveChangesAsync(cancellationToken);
        }

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await DbSet
              .ToListAsync();
        }

        public IQueryable<TEntity> GetAll()
        {
            return DbContext.Set<TEntity>();
        }

        protected virtual async Task<TEntity> InnerAddAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
          return entity;
        }

        protected virtual async Task InnerUpdateAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
        }

        protected virtual async Task InnerDeleteAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
        }
    }
}
