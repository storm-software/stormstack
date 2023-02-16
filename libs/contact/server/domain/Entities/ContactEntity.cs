using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Contact.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;
using System.Globalization;

namespace OpenSystem.Contact.Domain.Entities
{
    public class ContactEntity
      : AddressEntity, IAggregateRoot
    {
        public string Email { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? PhoneNumber { get; set; }

        public bool IsSubscribed { get; set; }

        public IList<ContactDetailEntity> Details { get; set; } = new List<ContactDetailEntity>();
    }
}
