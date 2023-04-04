using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Repositories
{
    public interface IAuditableEntityRepository<TEntity, TEntityId>
        : IBaseRepository<TEntity, TEntityId>
        where TEntity : AuditableEntity<TEntityId>
        where TEntityId : EntityId { }
}
