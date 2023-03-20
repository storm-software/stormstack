using OpenSystem.Core.Domain.Entities;
using OpenSystem.Contact.Domain.Enums;

namespace OpenSystem.Contact.Domain.Entities
{
    public class ContactDetailEntity
      : Entity
    {
        public ContactReasonTypes Reason { get; set; }

        public string? Details { get; set; }

        public string? Url { get; set; }

        public string? Title { get; set; }

        public string? CompanyName { get; set; }

        public ContactEntity Contact { get; set; }
    }
}
