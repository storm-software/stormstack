using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public interface IEntity<TEntityId> : IIndexed<TEntityId>
        where TEntityId : EntityId { }
}
