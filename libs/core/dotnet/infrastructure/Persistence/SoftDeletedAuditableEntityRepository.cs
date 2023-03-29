using OpenSystem.Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using OpenSystem.Core.Domain.Entities;
using AutoMapper;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Infrastructure.Persistence.Extensions;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public abstract class SoftDeletedAuditableEntityRepository<TEntity, TEntityId>
        : AuditableEntityRepository<TEntity, TEntityId>
        where TEntity : SoftDeletedAuditableEntity<TEntityId>
        where TEntityId : EntityId
    {
        public SoftDeletedAuditableEntityRepository(
            IMapper mapper,
            BaseDbContext<TEntity, TEntityId> dbContext,
            ICurrentUserService currentUserService,
            IDateTimeProvider dateTimeProvider
        )
            : base(mapper, dbContext, currentUserService, dateTimeProvider) { }

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

        protected virtual ValueTask<TEntity> InnerRestoreAsync(
            TEntity entity,
            CancellationToken cancellationToken = default
        )
        {
            return ValueTask.FromResult(entity);
        }
    }
}
