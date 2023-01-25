using System;
using OpenSystem.Core.DotNet.Domain.Enums;

namespace OpenSystem.Core.DotNet.Domain.Common
{
    public abstract class AuditableBaseEntity<TEntityId>
      : BaseEntity<TEntityId>
      where TEntityId : EntityId
    {
        public int EventCounter { get; set; }

        public VerificationCodeTypes verificationCode { get; set; }

        public string CreatedBy { get; set; }

        public DateTimeOffset CreatedOn { get; set; }

        public string? ModifiedBy { get; set; }

        public DateTimeOffset? ModifiedOn { get; set; }
    }
}
