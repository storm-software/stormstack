using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public abstract class SoftDeletedAuditableEntity<TEntityId>
        : AuditableEntity<TEntityId>,
            ISoftDeleted
        where TEntityId : EntityId
    {
        public bool IsDeleted { get; set; } = false;

        public DateTimeOffset? DeletedDateTime { get; set; }

        public string? DeletedBy { get; set; }

        public async ValueTask<SoftDeletedAuditableEntity<TEntityId>> SetForDeleteAsync(
            string deletedBy,
            DateTimeOffset deletedDateTime
        )
        {
            if (this is ISoftDeleted softDeleted)
            {
                softDeleted.DeletedBy = deletedBy;
                softDeleted.DeletedDateTime = deletedDateTime;
                softDeleted.IsDeleted = true;
                EventType = EntityEventTypes.Delete;
            }

            await InnerSetForDeleteAsync(deletedBy, deletedDateTime);
            SetStatus(EntityStatusTypes.Removed);

            return this;
        }

        public async ValueTask<SoftDeletedAuditableEntity<TEntityId>> SetForRestoreAsync(
            string restoredBy,
            DateTimeOffset restoredDateTime
        )
        {
            if (this is ISoftDeleted softDeleted)
            {
                softDeleted.DeletedBy = null;
                softDeleted.DeletedDateTime = null;
                softDeleted.IsDeleted = false;
                EventType = EntityEventTypes.Restore;
            }

            await InnerSetForRestoreAsync(restoredBy, restoredDateTime);
            SetStatus(EntityStatusTypes.Active);

            return this;
        }

        protected virtual ValueTask<SoftDeletedAuditableEntity<TEntityId>> InnerSetForDeleteAsync(
            string deletedBy,
            DateTimeOffset deletedDateTime
        )
        {
            return ValueTask.FromResult(this);
        }

        protected virtual ValueTask<SoftDeletedAuditableEntity<TEntityId>> InnerSetForRestoreAsync(
            string restoredBy,
            DateTimeOffset restoredDateTime
        )
        {
            return ValueTask.FromResult(this);
        }
    }
}
