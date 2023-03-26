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
    public class Persistence<TTo> : IPersistence<TTo>
        where TTo : class
    {
        private readonly IMapper _mapper;

        protected DbSet<TTo> SourceSet { get; set; }

        public Persistence(DbSet<TTo> sourceSet, IMapper mapper)
        {
            SourceSet = sourceSet;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public TTo InsertOrUpdate<TFrom>(TFrom from)
            where TFrom : class => InsertOrUpdate(typeof(TFrom), from);

        public Task<TTo> InsertOrUpdateAsync<TFrom>(
            TFrom from,
            CancellationToken cancellationToken = default
        )
            where TFrom : class => InsertOrUpdateAsync(typeof(TFrom), from, cancellationToken);

        public TTo InsertOrUpdate(Type type, object from)
        {
            var equivExpr = GetEquivalenceExpression(type, from);
            if (equivExpr == null)
            {
                throw new ArgumentException(
                    $"Could not retrieve equivalency expression for mapping {type.Name} --> {typeof(TTo).Name}"
                );
            }

            var to = GetSourceSet().FirstOrDefault(equivExpr);

            return MapObject(type, from, to);
        }

        public async Task<TTo> InsertOrUpdateAsync(
            Type type,
            object from,
            CancellationToken cancellationToken = default
        )
        {
            cancellationToken.ThrowIfCancellationRequested();

            var equivExpr = GetEquivalenceExpression(type, from);
            if (equivExpr == null)
            {
                throw new ArgumentException(
                    $"Could not retrieve equivalency expression for mapping {type.Name} --> {typeof(TTo).Name}"
                );
            }

            var to = await GetSourceSet()
                .FirstOrDefaultAsync(equivExpr, cancellationToken)
                .ConfigureAwait(false);

            return MapObject(type, from, to);
        }

        public TTo Remove<TFrom>(TFrom from)
            where TFrom : class
        {
            var equivExpr = GetEquivalenceExpression(from);
            if (equivExpr == null)
            {
                throw new ArgumentException(
                    $"Could not retrieve equivalency expression for mapping {typeof(TFrom).Name} --> {typeof(TTo).Name}"
                );
            }

            var to = GetSourceSet().FirstOrDefault(equivExpr);

            if (to != null)
            {
                GetSourceSet().Remove(to);
            }

            return MapObject(typeof(TFrom), from, to);
        }

        public async Task<TTo> RemoveAsync<TFrom>(
            TFrom from,
            CancellationToken cancellationToken = default
        )
            where TFrom : class
        {
            cancellationToken.ThrowIfCancellationRequested();

            var equivExpr = GetEquivalenceExpression(from);
            if (equivExpr == null)
            {
                throw new ArgumentException(
                    $"Could not retrieve equivalency expression for mapping {typeof(TFrom).Name} --> {typeof(TTo).Name}"
                );
            }

            var to = await GetSourceSet()
                .FirstOrDefaultAsync(equivExpr, cancellationToken)
                .ConfigureAwait(false);

            if (to != null)
            {
                GetSourceSet().Remove(to);
            }

            return MapObject(typeof(TFrom), from, to);
        }

        private TTo MapObject(Type type, object from, TTo to)
        {
            if (to == null)
            {
                to = (TTo)_mapper.Map(from, type, typeof(TTo));
                GetSourceSet().Add(to);
            }
            else
            {
                _mapper.Map(from, to);
            }
            return to;
        }

        protected virtual DbSet<TTo> GetSourceSet() => SourceSet;

        private Expression<Func<TTo, bool>> GetEquivalenceExpression<TFrom>(TFrom from) =>
            GetEquivalenceExpression(typeof(TFrom), from);

        private Expression<Func<TTo, bool>> GetEquivalenceExpression(Type type, object from) =>
            _mapper.Map(from, type, typeof(Expression<Func<TTo, bool>>))
            as Expression<Func<TTo, bool>>;
    }
}
