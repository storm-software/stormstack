using OpenSystem.Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Application.Services;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public abstract class BaseReadOnlyRepository<TEntity> : IBaseReadOnlyRepository<TEntity>
        where TEntity : AggregateRoot
    {
        protected BaseDbContext<TEntity> DbContext { get; init; }

        protected DbSet<TEntity> DataSet { get; init; }

        protected ICurrentUserService CurrentUserService { get; init; }

        protected IDateTimeProvider DateTimeProvider { get; init; }

        public BaseReadOnlyRepository(
            BaseDbContext<TEntity> dbContext,
            ICurrentUserService currentUserService,
            IDateTimeProvider dateTimeProvider
        )
        {
            DataSet = dbContext.Set<TEntity>();
            DbContext = dbContext;
            CurrentUserService = currentUserService;
            DateTimeProvider = dateTimeProvider;
        }

        public IQueryable<TEntity> GetQueryable()
        {
            return DataSet.AsNoTracking();
        }

        public IQueryable<TEntity> GetQueryable(
            int? pageNumber,
            int? pageSize,
            string? orderBy = null,
            string? fields = null
        )
        {
            var records = DataSet.AsQueryable();
            if (!string.IsNullOrEmpty(orderBy))
                records = records.OrderBy(orderBy);

            if (pageNumber != null && pageSize != null)
                records = records.Skip(((int)pageNumber - 1) * (int)pageSize).Take((int)pageSize);

            if (!string.IsNullOrEmpty(fields))
                records = records.Select<TEntity>("new(" + fields + ")");

            return records.AsNoTracking();
        }

        public virtual async Task<IList<TEntity>> GetAllAsync(
            int? pageNumber,
            int? pageSize,
            string? orderBy,
            string? fields
        )
        {
            return await GetQueryable(pageNumber, pageSize, orderBy, fields).ToListAsync();
        }

        public virtual async Task<TEntity?> GetByIdAsync(
            Guid guid,
            CancellationToken cancellationToken = default
        )
        {
            return await DataSet
                .AsNoTracking()
                .Where(r => r.Id == guid)
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
