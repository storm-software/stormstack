using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Repositories
{
    public interface IBaseRepository<TEntity> : IBaseReadOnlyRepository<TEntity>
        where TEntity : AggregateRoot
    {
        IBaseUnitOfWork UnitOfWork { get; }

        Task<TEntity> AddOrUpdateAsync<TDto>(
            TDto dto,
            CancellationToken cancellationToken = default
        )
            where TDto : class;

        Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);

        Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);

        Task<TEntity> DeleteAsync<TDto>(TDto dto, CancellationToken cancellationToken = default)
            where TDto : class;

        Task<TEntity> RestoreAsync<TDto>(TDto dto, CancellationToken cancellationToken = default)
            where TDto : class;
    }
}
