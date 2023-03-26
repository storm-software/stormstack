using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Core.Infrastructure.Persistence
{
    public class EntityStorage<TEntity> : IEntityStorage<TEntity>
        where TEntity : class
    {
        private readonly IMapper _mapper;

        protected DbSet<TEntity> DataSet { get; set; }

        public EntityStorage(DbSet<TEntity> dataset, IMapper mapper)
        {
            DataSet = dataset;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public TEntity AddOrUpdate<TDto>(TDto dto)
            where TDto : class => AddOrUpdate(typeof(TDto), dto);

        public Task<TEntity> AddOrUpdateAsync<TDto>(
            TDto dto,
            CancellationToken cancellationToken = default
        )
            where TDto : class => AddOrUpdateAsync(typeof(TDto), dto, cancellationToken);

        public TEntity AddOrUpdate(Type type, object dto)
        {
            var equivExpr = GetEquivalenceExpression(type, dto);
            if (equivExpr == null)
            {
                throw new ArgumentException(
                    $"Could not retrieve equivalency expression for mapping {type.Name} --> {typeof(TEntity).Name}"
                );
            }

            return MapObject(type, dto, DataSet.FirstOrDefault(equivExpr));
        }

        public async Task<TEntity> AddOrUpdateAsync(
            Type type,
            object dto,
            CancellationToken cancellationToken = default
        )
        {
            cancellationToken.ThrowIfCancellationRequested();

            var equivExpr = GetEquivalenceExpression(type, dto);
            if (equivExpr == null)
            {
                throw new ArgumentException(
                    $"Could not retrieve equivalency expression for mapping {type.Name} --> {typeof(TEntity).Name}"
                );
            }

            var entity = await DataSet
                .FirstOrDefaultAsync(equivExpr, cancellationToken)
                .ConfigureAwait(false);

            return MapObject(type, dto, entity);
        }

        public TEntity Remove<TDto>(TDto dto)
            where TDto : class
        {
            var equivExpr = GetEquivalenceExpression(dto);
            if (equivExpr == null)
            {
                throw new ArgumentException(
                    $"Could not retrieve equivalency expression for mapping {typeof(TDto).Name} --> {typeof(TEntity).Name}"
                );
            }

            var entity = DataSet.FirstOrDefault(equivExpr);
            if (entity != null)
                DataSet.Remove(entity);

            return MapObject(typeof(TDto), dto, entity);
        }

        public async Task<TEntity> RemoveAsync<TDto>(
            TDto dto,
            CancellationToken cancellationToken = default
        )
            where TDto : class
        {
            cancellationToken.ThrowIfCancellationRequested();

            var equivExpr = GetEquivalenceExpression(dto);
            if (equivExpr == null)
                throw new ArgumentException(
                    $"Could not retrieve equivalency expression for mapping {typeof(TDto).Name} --> {typeof(TEntity).Name}"
                );

            var entity = await DataSet
                .FirstOrDefaultAsync(equivExpr, cancellationToken)
                .ConfigureAwait(false);

            if (entity != null)
            {
                DataSet.Remove(entity);
            }

            return MapObject(typeof(TDto), dto, entity);
        }

        private TEntity MapObject(Type type, object dto, TEntity? entity)
        {
            if (entity == null)
            {
                entity = (TEntity)_mapper.Map(dto, type, typeof(TEntity));
                DataSet.Add(entity);
            }
            else
                _mapper.Map(dto, entity);

            return entity;
        }

        private Expression<Func<TEntity, bool>>? GetEquivalenceExpression<TDto>(TDto dto) =>
            GetEquivalenceExpression(typeof(TDto), dto);

        private Expression<Func<TEntity, bool>>? GetEquivalenceExpression(Type type, object? dto) =>
            _mapper.Map(dto, type, typeof(Expression<Func<TEntity, bool>>))
            as Expression<Func<TEntity, bool>>;
    }
}
