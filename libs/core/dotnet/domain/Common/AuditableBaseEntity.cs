using System;
using OpenSystem.Core.DotNet.Domain.Enums;
using OpenSystem.Core.DotNet.Domain.ValueObjects;

namespace OpenSystem.Core.DotNet.Domain.Common
{
    public abstract class AuditableBaseEntity<TEntityId, TValueId>
      : BaseEntity<TEntityId, TValueId>
      where TEntityId : EntityId<TValueId>
    {
        public int EventCounter { get; set; }

        public VerificationCodeTypes verificationCode { get; set; }

        public string CreatedBy { get; set; }

        public DateTimeOffset CreatedOn { get; set; }

        public string? ModifiedBy { get; set; }

        public DateTimeOffset? ModifiedOn { get; set; }
    }
}
