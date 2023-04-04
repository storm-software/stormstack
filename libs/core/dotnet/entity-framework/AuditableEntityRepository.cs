using OpenSystem.Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using OpenSystem.Core.Domain.Entities;
using AutoMapper;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.EntityFramework.Extensions;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.EntityFramework
{
    public abstract class AuditableEntityRepository<TEntity, TEntityId>
        : BaseRepository<TEntity, TEntityId>
        where TEntity : AuditableEntity<TEntityId>
        where TEntityId : EntityId
    {
        public AuditableEntityRepository(
            IMapper mapper,
            BaseDbContext<TEntity, TEntityId> dbContext,
            ICurrentUserService currentUserService,
            IDateTimeProvider dateTimeProvider
        )
            : base(mapper, dbContext, currentUserService, dateTimeProvider) { }

        public override async Task<TEntity> AddOrUpdateAsync<TDto>(
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
    }
}
