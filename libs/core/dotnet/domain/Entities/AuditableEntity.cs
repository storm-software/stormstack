using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public abstract class AuditableEntity<TEntityId> : VersionedEntity<TEntityId>, IAuditable
        where TEntityId : EntityId
    {
        public EntityStatusTypes Status { get; set; } = EntityStatusTypes.Pending;

        public EntityEventTypes EventType { get; set; } = EntityEventTypes.View;

        public bool IsApproved { get; set; } = false;

        public string? CreatedBy { get; set; }

        public DateTimeOffset? CreatedDateTime { get; set; }

        public string? UpdatedBy { get; set; }

        public DateTimeOffset? UpdatedDateTime { get; set; }

        [NotMapped]
        public EntityProcessingTypes ProcessingType { get; set; } =
            EntityProcessingTypes.StraightThroughProcessing;

        public async ValueTask<AuditableEntity<TEntityId>> SetForCreateAsync(
            string createdBy,
            DateTimeOffset createdDateTime
        )
        {
            CreatedBy = createdBy;
            CreatedDateTime = createdDateTime;
            Version = 1;
            EventType = EntityEventTypes.Create;

            await InnerSetForCreateAsync(createdBy, createdDateTime);

            return SetStatus(EntityStatusTypes.Active);
        }

        public async ValueTask<AuditableEntity<TEntityId>> SetForUpdateAsync(
            string updatedBy,
            DateTimeOffset updatedDateTime
        )
        {
            UpdatedBy = updatedBy;
            UpdatedDateTime = updatedDateTime;
            Version++;
            EventType = EntityEventTypes.Update;

            await InnerSetForUpdateAsync(updatedBy, updatedDateTime);

            return SetStatus(EntityStatusTypes.Active);
        }

        public virtual AuditableEntity<TEntityId> SetStatus(EntityStatusTypes nextStatus)
        {
            if (ProcessingType == EntityProcessingTypes.StraightThroughProcessing)
            {
                IsApproved = true;
                Status = nextStatus;
            }
            else
            {
                IsApproved = false;
                Status =
                    nextStatus == EntityStatusTypes.Removed
                        ? EntityStatusTypes.Inactive
                        : EntityStatusTypes.Pending;
            }

            return this;
        }

        protected async virtual ValueTask<AuditableEntity<TEntityId>> InnerSetForCreateAsync(
            string createdBy,
            DateTimeOffset createdDateTime
        )
        {
            return this;
        }

        protected async virtual ValueTask<AuditableEntity<TEntityId>> InnerSetForUpdateAsync(
            string updatedBy,
            DateTimeOffset updatedDateTime
        )
        {
            return this;
        }
    }
}
