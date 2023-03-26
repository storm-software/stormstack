using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public abstract class AuditableEntity : Entity, IAuditable
    {
        public ulong EventCounter { get; set; } = 0;

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

        public async ValueTask<AuditableEntity> SetForCreateAsync(
            string createdBy,
            DateTimeOffset createdDateTime
        )
        {
            CreatedBy = createdBy;
            CreatedDateTime = createdDateTime;
            EventCounter = 1;
            EventType = EntityEventTypes.Create;

            await InnerSetForCreateAsync(createdBy, createdDateTime);

            return SetStatus(EntityStatusTypes.Active);
        }

        public async ValueTask<AuditableEntity> SetForUpdateAsync(
            string updatedBy,
            DateTimeOffset updatedDateTime
        )
        {
            UpdatedBy = updatedBy;
            UpdatedDateTime = updatedDateTime;
            EventCounter++;
            EventType = EntityEventTypes.Update;

            await InnerSetForUpdateAsync(updatedBy, updatedDateTime);

            return SetStatus(EntityStatusTypes.Active);
        }

        public virtual AuditableEntity SetStatus(EntityStatusTypes nextStatus)
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

        protected async virtual ValueTask<AuditableEntity> InnerSetForCreateAsync(
            string createdBy,
            DateTimeOffset createdDateTime
        )
        {
            return this;
        }

        protected async virtual ValueTask<AuditableEntity> InnerSetForUpdateAsync(
            string updatedBy,
            DateTimeOffset updatedDateTime
        )
        {
            return this;
        }
    }
}
