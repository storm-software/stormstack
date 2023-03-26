using OpenSystem.Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using OpenSystem.Core.Domain.Entities;
using AutoMapper;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Infrastructure.Persistence.Extensions;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public abstract class BaseRepository<TEntity> : IBaseRepository<TEntity>
        where TEntity : AggregateRoot
    {
        public IBaseUnitOfWork UnitOfWork { get; init; }

        protected BaseDbContext<TEntity> DbContext { get; init; }

        protected DbSet<TEntity> DataSet { get; init; }

        protected ICurrentUserService CurrentUserService { get; init; }

        protected IDateTimeProvider DateTimeProvider { get; init; }

        protected IMapper Mapper { get; init; }

        public BaseRepository(
            IMapper mapper,
            BaseDbContext<TEntity> dbContext,
            ICurrentUserService currentUserService,
            IDateTimeProvider dateTimeProvider
        )
        {
            DataSet = dbContext.Set<TEntity>();
            UnitOfWork = dbContext;
            DbContext = dbContext;
            CurrentUserService = currentUserService;
            DateTimeProvider = dateTimeProvider;
            Mapper = mapper;
        }

        public IQueryable<TEntity> GetQueryable(bool noTracking = true)
        {
            return noTracking ? DataSet.AsNoTracking() : DataSet.AsQueryable();
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
            return await DataSet.FindAsync(guid, cancellationToken);
        }

        public virtual async Task<TEntity> AddOrUpdateAsync<TDto>(
            TDto dto,
            CancellationToken cancellationToken = default
        )
            where TDto : class
        {
            TEntity entity = await DataSet
                .Persist<TEntity>(Mapper)
                .InsertOrUpdateAsync<TDto>(dto, cancellationToken);
            if (!entity.CreatedDateTime.HasValue)
                return await AddAsync(entity, cancellationToken);
            else
                return await UpdateAsync(entity, cancellationToken);
        }

        public async Task<TEntity> AddAsync(
            TEntity entity,
            CancellationToken cancellationToken = default
        )
        {
            //DbContext.Entry(entity).State = EntityState.Added;
            /*DbContext.Entry(entity).State = EntityState.Added;
            await DbSet.AddAsync(entity,
              cancellationToken);*/

            /*await entity.SetForCreateAsync(
                CurrentUserService.UserId,
                DateTimeProvider.OffsetUtcNow
            );*/

            return await InnerAddAsync(entity, cancellationToken);
        }

        public async Task<TEntity> UpdateAsync(
            TEntity entity,
            CancellationToken cancellationToken = default
        )
        {
            DbContext.Entry(entity).State = EntityState.Modified;
            /*await entity.SetForUpdateAsync(
                CurrentUserService.UserId,
                DateTimeProvider.OffsetUtcNow
            );*/

            return await InnerUpdateAsync(entity, cancellationToken);
        }

        public async Task<TEntity> DeleteAsync<TDto>(
            TDto dto,
            CancellationToken cancellationToken = default
        )
            where TDto : class
        {
            TEntity entity = await DataSet
                .Persist<TEntity>(Mapper)
                .RemoveAsync<TDto>(dto, cancellationToken);

            return await InnerDeleteAsync(entity, cancellationToken);
        }

        public async Task<TEntity> RestoreAsync<TDto>(
            TDto dto,
            CancellationToken cancellationToken = default
        )
            where TDto : class
        {
            TEntity entity = await DataSet
                .Persist<TEntity>(Mapper)
                .InsertOrUpdateAsync<TDto>(dto, cancellationToken);

            entity = (TEntity)
                await entity.SetForRestoreAsync(
                    CurrentUserService.UserId,
                    DateTimeProvider.OffsetUtcNow
                );

            return await InnerRestoreAsync(entity, cancellationToken);
        }

        protected virtual ValueTask<TEntity> InnerAddAsync(
            TEntity entity,
            CancellationToken cancellationToken = default
        )
        {
            return ValueTask.FromResult(entity);
        }

        protected virtual ValueTask<TEntity> InnerUpdateAsync(
            TEntity entity,
            CancellationToken cancellationToken = default
        )
        {
            return ValueTask.FromResult(entity);
        }

        protected virtual ValueTask<TEntity> InnerDeleteAsync(
            TEntity entity,
            CancellationToken cancellationToken = default
        )
        {
            return ValueTask.FromResult(entity);
        }

        protected virtual ValueTask<TEntity> InnerRestoreAsync(
            TEntity entity,
            CancellationToken cancellationToken = default
        )
        {
            return ValueTask.FromResult(entity);
        }
    }
}
