using OpenSystem.Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using OpenSystem.Core.Domain.Entities;
using AutoMapper;
using AutoMapper.EntityFrameworkCore;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public abstract class BaseRepository<TEntity>
      : IBaseRepository<TEntity>
      where TEntity : AggregateRoot
    {
      public IBaseUnitOfWork UnitOfWork { get; init; }

      protected DbSet<TEntity> DataSet { get; init; }

      protected ICurrentUserService CurrentUserService { get; init; }

      protected IDateTimeProvider DateTimeProvider { get; init; }

      private readonly IMapper _mapper;

      public BaseRepository(IMapper mapper,
        BaseDbContext<TEntity> dbContext,
        ICurrentUserService currentUserService,
        IDateTimeProvider dateTimeProvider)
      {
          DataSet = dbContext.Set<TEntity>();
          UnitOfWork = dbContext;
          CurrentUserService = currentUserService;
          DateTimeProvider = dateTimeProvider;
          _mapper = mapper;
      }

      public IQueryable<TEntity> GetQueryable(bool noTracking = true)
      {
        return noTracking
          ? DataSet.AsNoTracking()
          : DataSet.AsQueryable();
      }

      public IQueryable<TEntity> GetQueryable(int? pageNumber,
        int? pageSize,
        string? orderBy = null,
        string? fields = null)
      {
        var records = DataSet.AsQueryable();
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

      public virtual async Task<IList<TEntity>> GetAllAsync(int? pageNumber,
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

      public virtual async Task<TEntity?> GetByIdAsync(Guid guid,
        CancellationToken cancellationToken = default)
      {
        return await DataSet.FindAsync(guid,
          cancellationToken);
      }

      public virtual async Task<TEntity> AddOrUpdateAsync<TDto>(TDto dto,
        CancellationToken cancellationToken = default) where TDto : class
      {
        TEntity entity = await DataSet.Persist<TEntity>(_mapper)
          .InsertOrUpdateAsync<TDto>(dto,
            cancellationToken);
        if (!entity.CreatedDateTime.HasValue)
          return await AddAsync(entity,
            cancellationToken);
        else
          return await UpdateAsync(entity,
            cancellationToken);
      }

        /*private Expression<Func<TTo, bool>> GetEquivalenceExpression<TFrom>(TFrom from) =>
          GetEquivalenceExpression(typeof(TFrom), from);

        private Expression<Func<TTo, bool>> GetEquivalenceExpression(Type type, object from) =>
          _mapper.Map(from, type, typeof(Expression<Func<TTo, bool>>)) as Expression<Func<TTo, bool>>;*/

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

        /*public async Task<TEntity> AddOrUpdateAsync(TEntity entity,
          CancellationToken cancellationToken = default)
        {
            if (entity.Id.Equals(default))
                await AddAsync(entity,
                  cancellationToken);
            else
                await UpdateAsync(entity,
                  cancellationToken);

            return entity;
        }*/

      public async Task<TEntity> AddAsync(TEntity entity,
        CancellationToken cancellationToken = default)
      {
        /*DbContext.Entry(entity).State = EntityState.Added;
        await DbSet.AddAsync(entity,
          cancellationToken);*/

        await entity.SetForCreateAsync(CurrentUserService.UserId,
          DateTimeProvider.OffsetUtcNow);

        return await InnerAddAsync(entity,
          cancellationToken);
      }

      public async Task<TEntity> UpdateAsync(TEntity entity,
        CancellationToken cancellationToken = default)
      {
          // DbContext.Entry(entity).State = EntityState.Modified;

        await entity.SetForUpdateAsync(CurrentUserService.UserId,
          DateTimeProvider.OffsetUtcNow);

        return await InnerUpdateAsync(entity,
            cancellationToken);
      }

      public async Task<TEntity> DeleteAsync(TEntity entity,
        CancellationToken cancellationToken = default)
      {
        await entity.SetForDeleteAsync(CurrentUserService.UserId,
          DateTimeProvider.OffsetUtcNow);
        await InnerDeleteAsync(entity,
          cancellationToken);

        DataSet.Remove(entity);

        return entity;
      }

      protected virtual async ValueTask<TEntity> InnerAddAsync(TEntity entity,
        CancellationToken cancellationToken = default)
      {
        return entity;
      }

      protected virtual async ValueTask<TEntity> InnerUpdateAsync(TEntity entity,
        CancellationToken cancellationToken = default)
      {
        return entity;
      }

      protected virtual async ValueTask<TEntity> InnerDeleteAsync(TEntity entity,
        CancellationToken cancellationToken = default)
      {
        return entity;
      }
  }
}
