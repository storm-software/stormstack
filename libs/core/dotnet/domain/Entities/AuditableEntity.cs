using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public abstract class AuditableEntity
      : Entity, IAuditable
    {
      public int EventCounter { get; set; } = 0;

      public EntityStatusTypes Status { get; set; } = EntityStatusTypes.Pending;

      public EntityEventTypes EventType { get; set; } = EntityEventTypes.View;

      public bool IsApproved { get; set; } = false;

      public string? CreatedBy { get; set; } = "PSUL2";

      public DateTimeOffset? CreatedDateTime { get; set; }

      public string? UpdatedBy { get; set; }

      public DateTimeOffset? UpdatedDateTime { get; set; }

      [NotMapped]
      public EntityProcessingTypes ProcessingType { get; set; } = EntityProcessingTypes.StraightThroughProcessing;
   }
}
