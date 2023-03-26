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
    public abstract class BaseRepository<TEntity>
        : BaseReadOnlyRepository<TEntity>,
            IBaseRepository<TEntity>
        where TEntity : AggregateRoot
    {
        public IBaseUnitOfWork UnitOfWork { get; init; }

        protected IMapper Mapper { get; init; }

        public BaseRepository(
            IMapper mapper,
            BaseDbContext<TEntity> dbContext,
            ICurrentUserService currentUserService,
            IDateTimeProvider dateTimeProvider
        )
            : base(dbContext, currentUserService, dateTimeProvider)
        {
            UnitOfWork = dbContext;
            Mapper = mapper;
        }

        public virtual async Task<TEntity> AddOrUpdateAsync<TDto>(
            TDto dto,
            CancellationToken cancellationToken = default
        )
            where TDto : class
        {
            TEntity entity = await DataSet
                .EntityStorage<TEntity>(Mapper)
                .AddOrUpdateAsync<TDto>(dto, cancellationToken);
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
            return await InnerAddAsync(entity, cancellationToken);
        }

        public async Task<TEntity> UpdateAsync(
            TEntity entity,
            CancellationToken cancellationToken = default
        )
        {
            DbContext.Entry(entity).State = EntityState.Modified;
            return await InnerUpdateAsync(entity, cancellationToken);
        }

        public async Task<TEntity> DeleteAsync<TDto>(
            TDto dto,
            CancellationToken cancellationToken = default
        )
            where TDto : class
        {
            TEntity entity = await DataSet
                .EntityStorage<TEntity>(Mapper)
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
                .EntityStorage<TEntity>(Mapper)
                .AddOrUpdateAsync<TDto>(dto, cancellationToken);

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
