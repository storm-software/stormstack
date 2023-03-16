using OpenSystem.Core.Application.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.Enums;
using LinqKit;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Metadata;
using AutoMapper;
using AutoMapper.EntityFrameworkCore;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public class BaseRepository<TEntity>
      : IBaseRepository<TEntity>
      where TEntity : AuditableEntity, IAggregateRoot
    {
        public IBaseUnitOfWork UnitOfWork { get; }

        protected readonly BaseDbContext<TEntity> DbContext;

        protected DbSet<TEntity> DbSet => DbContext.Set<TEntity>();

        private readonly IMapper _mapper;

        public BaseRepository(BaseDbContext<TEntity> dbContext,
          IMapper mapper)
        {
            DbContext = dbContext;
            UnitOfWork = dbContext;
            _mapper = mapper;
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

        public virtual async Task<TEntity> FirstOrDefaultAsync<TDto>(TDto dto,
          CancellationToken cancellationToken = default) where TDto : class
        {
          /*var typeMap =  GetTypeMap<TSource, TDestination>();

          var primaryKey = DbSet.EntityType.FindPrimaryKey()?.Properties
            ?? new List<IProperty>();*/

          TEntity entity = await DbSet.Persist(_mapper).InsertOrUpdateAsync<TDto>(dto,
            cancellationToken);

          /*DbSet.Where(p => primaryKey.Any(m => m.Name == p.DestinationMember.Name));
          primaryKey.Select(p => p.Name).ToList();*/

          return entity;

        }


        /*public IEnumerable<object> GeneratePropertyMaps(object typeMap)
        {
            //var propertyMaps = typeMap.PropertyMaps;
            var keyMembers = _model.FindEntityType("name").fin ?.FindPrimaryKey().Properties ?? new List<IProperty>();
            return propertyMaps.Where(p => keyMembers.Any(m => m.Name == p.DestinationMember.Name));
        }

        public async Task<TEntity> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate,
          CancellationToken cancellationToken = default)
        {

           var result = await DbSet.FirstOrDefaultAsync(predicate,
              cancellationToken);
DbSet.
            return result;
              result

            entity = await InnerAddAsync(entity,
              cancellationToken);

            return entity;
        }*/

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

            return entity;
        }

        public async Task UpdateAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
            DbContext.Entry(entity).State = EntityState.Modified;

            await InnerUpdateAsync(entity,
              cancellationToken);
        }

        public async Task DeleteAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
            DbSet.Remove(entity);
            await InnerDeleteAsync(entity,
              cancellationToken);
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
