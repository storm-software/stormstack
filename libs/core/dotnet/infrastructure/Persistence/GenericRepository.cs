using OpenSystem.Core.DotNet.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace OpenSystem.Core.DotNet.Infrastructure.Persistence
{
    public class GenericRepository<T>
      : IGenericRepository<T>
      where T : class
    {
        protected readonly ApplicationDbContext DbContext;

        protected readonly DbSet<T> RootDataSet;

        public GenericRepository(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
            RootDataSet = DbContext.Set<T>();
        }


        public virtual async Task<T> GetByIdAsync(Guid guid)
        {
            return await DbContext.Set<T>().FindAsync(guid);
        }

        public async Task<IEnumerable<T>> GetPagedResultAsync(int pageNumber,
          int pageSize)
        {
            return await DbContext
              .Set<T>()
              .Skip((pageNumber - 1) * pageSize)
              .Take(pageSize)
              .AsNoTracking()
              .ToListAsync();
        }

        public async Task<IEnumerable<T>> GetPagedAdvancedResultAsync(int pageNumber,
          int pageSize,
          string orderBy,
          string fields)
        {
            return await DbContext
              .Set<T>()
              .Skip((pageNumber - 1) * pageSize)
              .Take(pageSize)
              .Select<T>("new(" + fields + ")")
              .OrderBy(orderBy)
              .AsNoTracking()
              .ToListAsync();
        }

        public async Task<T> AddAsync(T entity)
        {
            await DbContext.Set<T>().AddAsync(entity);
            await DbContext.SaveChangesAsync();

            return entity;
        }

        public async Task UpdateAsync(T entity)
        {
            DbContext.Entry(entity).State = EntityState.Modified;
            await DbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            DbContext.Set<T>().Remove(entity);
            await DbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await DbContext
              .Set<T>()
              .ToListAsync();
        }
    }
}
