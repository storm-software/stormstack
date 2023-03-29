using OpenSystem.Core.Domain.Entities;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Repositories
{
    public interface IAuditableEntityRepository<TEntity, TEntityId>
        : IBaseRepository<TEntity, TEntityId>
        where TEntity : AuditableEntity<TEntityId>
        where TEntityId : EntityId { }
}
