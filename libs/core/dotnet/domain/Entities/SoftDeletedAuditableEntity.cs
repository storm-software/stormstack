using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Entities
{
    public abstract class SoftDeletedAuditableEntity : AuditableEntity, ISoftDeleted
    {
        public bool IsDeleted { get; set; } = false;

        public DateTimeOffset? DeletedDateTime { get; set; }

        public string? DeletedBy { get; set; }

        public async ValueTask<SoftDeletedAuditableEntity> SetForDeleteAsync(
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

        public async ValueTask<SoftDeletedAuditableEntity> SetForRestoreAsync(
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

        protected virtual ValueTask<SoftDeletedAuditableEntity> InnerSetForDeleteAsync(
            string deletedBy,
            DateTimeOffset deletedDateTime
        )
        {
            return ValueTask.FromResult(this);
        }

        protected virtual ValueTask<SoftDeletedAuditableEntity> InnerSetForRestoreAsync(
            string restoredBy,
            DateTimeOffset restoredDateTime
        )
        {
            return ValueTask.FromResult(this);
        }
    }
}
