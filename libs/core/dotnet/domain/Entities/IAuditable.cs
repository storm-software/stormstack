using System;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.Entities
{
    public interface IAuditable
    {
        public int EventCounter { get; set; }

        public VerificationCodeTypes VerificationCode { get; set; }

        public string CreatedBy { get; set; }

        public DateTimeOffset CreatedDateTime { get; set; }

        public string? UpdatedBy { get; set; }

        public DateTimeOffset? UpdatedDateTime { get; set; }
    }
}
