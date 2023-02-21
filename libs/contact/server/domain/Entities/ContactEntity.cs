using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Contact.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;
using System.Globalization;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Contact.Domain.Entities
{
    public class ContactEntity
      : AddressEntity, IAggregateRoot, IAuditable
    {
        public int EventCounter { get; set; } = 0;

        public VerificationCodeTypes VerificationCode { get; set; } = VerificationCodeTypes.Verified;

        public string CreatedBy { get; set; } = "PSUL";

        public DateTimeOffset CreatedDateTime { get; set; }

        public string? UpdatedBy { get; set; }

        public DateTimeOffset? UpdatedDateTime { get; set; }

        public string Email { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? PhoneNumber { get; set; }

        public bool IsSubscribed { get; set; }

        public IList<ContactDetailEntity> Details { get; set; } = new List<ContactDetailEntity>();
    }
}
