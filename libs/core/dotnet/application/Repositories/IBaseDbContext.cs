using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Repositories
{
    public interface IBaseDbContext<TEntity, TEntityId> : IBaseUnitOfWork
        where TEntity : IEntity<TEntityId>
        where TEntityId : EntityId { }
}
