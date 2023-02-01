using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Contact.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;
using System.Globalization;

namespace OpenSystem.Contact.Domain.Entities
{
    public class ContactDetailEntity : Entity<Guid>
    {
        public ContactReasonTypes ReasonType { get; set; }

        public string? Comment { get; set; }

        public string Url { get; set; }

        public ContactEntity Contact { get; set; }
    }
}
