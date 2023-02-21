using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public abstract class AuditableEntity<T> : Entity<T>, IAuditable
    {
      public int EventCounter { get; set; } = 0;

      public VerificationCodeTypes VerificationCode { get; set; } = VerificationCodeTypes.Verified;

      public string CreatedBy { get; set; } = "PSUL";

      public DateTimeOffset CreatedDateTime { get; set; }

      public string? UpdatedBy { get; set; }

      public DateTimeOffset? UpdatedDateTime { get; set; }
   }
}
