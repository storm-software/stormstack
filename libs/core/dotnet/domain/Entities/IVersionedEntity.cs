using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public interface IVersionedEntity<TEntityId> : IEntity<TEntityId>, IVersioned
        where TEntityId : EntityId { }
}
