using System;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.Core.Application.Interfaces
{
    public interface IEntityStorage<TEntity>
    {
        /// <summary>
        /// Insert Or Update the <see cref="T:System.Data.Entity.DbSet`1"/> with <paramref name="dto"/>
        /// </summary>
        /// <remarks>Uses <see cref="AutoMapper.EquivalencyExpression.EquivalentExpressions.GenerateEquality"/>> to find equality between Source and From Types to determine if insert or update</remarks>
        /// <typeparam name="TDto">Source Type mapping dto</typeparam>
        /// <param name="dto">Object to update to <see cref="T:System.Data.Entity.DbSet`1"/></param>
        /// <returns>The updated or inserted entity</returns>
        TEntity AddOrUpdate<TDto>(TDto dto)
            where TDto : class;

        /// <summary>
        /// Insert Or Update the <see cref="T:System.Data.Entity.DbSet`1"/> with <paramref name="dto"/> asynchronously
        /// </summary>
        /// <remarks>Uses <see cref="AutoMapper.EquivalencyExpression.EquivalentExpressions.GenerateEquality"/>> to find equality between Source and From Types to determine if insert or update</remarks>
        /// <typeparam name="TDto">Source Type mapping dto</typeparam>
        /// <param name="dto">Object to update to <see cref="T:System.Data.Entity.DbSet`1"/></param>
        /// <param name="cancellationToken">A cancellation token to observe the task.</param>
        /// <returns>A task containing the updated or inserted entity</returns>
        Task<TEntity> AddOrUpdateAsync<TDto>(
            TDto dto,
            CancellationToken cancellationToken = default
        )
            where TDto : class;

        /// <summary>
        /// Insert Or Update the <see cref="T:System.Data.Entity.DbSet`1"/> with <paramref name="dto"/>
        /// </summary>
        /// <remarks>Uses <see cref="AutoMapper.EquivalencyExpression.EquivalentExpressions.GenerateEquality"/>> to find equality between Source and From Types to determine if insert or update</remarks>
        /// <param name="type">Source Type mapping dto</param>
        /// <param name="dto">Object to update to <see cref="T:System.Data.Entity.DbSet`1"/></param>
        /// <returns>The updated or inserted entity</returns>
        TEntity AddOrUpdate(Type type, object dto);

        /// <summary>
        /// Insert Or Update the <see cref="T:System.Data.Entity.DbSet`1"/> with <paramref name="dto"/> asynchronously
        /// </summary>
        /// <remarks>Uses <see cref="AutoMapper.EquivalencyExpression.EquivalentExpressions.GenerateEquality"/>> to find equality between Source and From Types to determine if insert or update</remarks>
        /// <param name="type">Source Type mapping dto</param>
        /// <param name="dto">Object to update to <see cref="T:System.Data.Entity.DbSet`1"/></param>
        /// <param name="cancellationToken">A cancellation token to observe the task.</param>
        /// <returns>A task containing the updated or inserted entity</returns>
        Task<TEntity> AddOrUpdateAsync(
            Type type,
            object dto,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Remove dto <see cref="T:System.Data.Entity.DbSet`1"/> with <paramref name="dto"/>
        /// </summary>
        /// <remarks>Uses <see cref="AutoMapper.EquivalencyExpression.EquivalentExpressions.GenerateEquality"/>> to find equality between Source and From Types to determine if insert or update</remarks>
        /// <typeparam name="TDto">Source Type mapping dto</typeparam>
        /// <param name="dto">Object to remove that is Equivalent in <see cref="T:System.Data.Entity.DbSet`1"/></param>
        TEntity Remove<TDto>(TDto dto)
            where TDto : class;

        /// <summary>
        /// Remove dto <see cref="T:System.Data.Entity.DbSet`1"/> with <paramref name="dto"/> asynchronously
        /// </summary>
        /// <remarks>Uses <see cref="AutoMapper.EquivalencyExpression.EquivalentExpressions.GenerateEquality"/>> to find equality between Source and From Types to determine if insert or update</remarks>
        /// <typeparam name="TDto">Source Type mapping dto</typeparam>
        /// <param name="dto">Object to remove that is Equivalent in <see cref="T:System.Data.Entity.DbSet`1"/></param>
        /// <param name="cancellationToken">A cancellation token to observe the task.</param>
        /// <returns>A task object indicating the status of the asynchronous operation</returns>
        Task<TEntity> RemoveAsync<TDto>(TDto dto, CancellationToken cancellationToken = default)
            where TDto : class;
    }
}
