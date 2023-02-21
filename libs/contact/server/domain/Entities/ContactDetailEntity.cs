using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Contact.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;
using System.Globalization;

namespace OpenSystem.Contact.Domain.Entities
{
    public class ContactDetailEntity : AuditableEntity<Guid>
    {
        public ContactReasonTypes Reason { get; set; }

        public string? Details { get; set; }

        public string? Url { get; set; }

        public string? Title { get; set; }

        public string? CompanyName { get; set; }

        public ContactEntity Contact { get; set; }
    }
}
