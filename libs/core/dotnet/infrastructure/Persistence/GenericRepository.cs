using OpenSystem.Core.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.Enums;
using LinqKit;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public class GenericRepository<TEntity>
      : IGenericRepository<TEntity>
      where TEntity : AuditableEntity<Guid>, IAggregateRoot
    {
        protected readonly ApplicationDbContext<TEntity> DbContext;

        protected DbSet<TEntity> DbSet => DbContext.Set<TEntity>();

        public GenericRepository(ApplicationDbContext<TEntity> dbContext)
        {
            DbContext = dbContext;
        }

        public IQueryable<TEntity> GetQueryable(bool noTracking = true)
        {
          return noTracking
            ? DbSet.AsNoTracking()
            : DbSet.AsQueryable();
        }

        public IQueryable<TEntity> GetQueryable(int? pageNumber,
          int? pageSize,
          string? orderBy = null,
          string? fields = null)
        {
          var records = DbSet.AsQueryable();
          if (!string.IsNullOrEmpty(orderBy))
            records = records.OrderBy(orderBy);

          if (pageNumber != null &&
            pageSize != null)
            records = records.Skip(((int)pageNumber - 1) * (int)pageSize)
            .Take((int)pageSize);

          if (!string.IsNullOrEmpty(fields))
            records = records.Select<TEntity>("new(" + fields + ")");

          return records.AsNoTracking();
        }

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync(int? pageNumber,
          int? pageSize,
          string? orderBy,
          string? fields)
        {
          return await GetQueryable(pageNumber,
              pageSize,
              orderBy,
              fields)
            .ToListAsync();
        }

        public virtual async Task<TEntity> GetByIdAsync(Guid guid)
        {
            return await DbSet.FindAsync(guid);
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

            await InnerUpdateAsync(entity,
              cancellationToken);

            await DbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
            DbContext.Entry(entity).State = EntityState.Modified;
            entity.VerificationCode = VerificationCodeTypes.Removed;

            await InnerDeleteAsync(entity,
              cancellationToken);

            await DbContext.SaveChangesAsync(cancellationToken);
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

        protected virtual ExpressionStarter<TEntity> GetBaseFilter(ExpressionStarter<TEntity>? predicate = null,
          bool includeUnverified = false)
        {
          predicate ??= PredicateBuilder.New<TEntity>();
          if (!includeUnverified)
              predicate = predicate.And(p =>
                p.VerificationCode <= VerificationCodeTypes.Verified);

            return predicate;
        }
    }
}
