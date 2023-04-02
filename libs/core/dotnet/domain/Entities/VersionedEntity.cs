using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public abstract class VersionedEntity<TEntityId>
        : Entity<TEntityId>,
            IVersionedEntity<TEntityId>
        where TEntityId : EntityId
    {
        public ulong Version { get; set; } = 0;
    }
}
