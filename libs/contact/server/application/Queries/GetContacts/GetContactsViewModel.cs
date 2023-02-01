using OpenSystem.Contact.Domain.Enums;
using System;

namespace OpenSystem.Contact.Application.Queries.GetContacts
{
 public class GetContactsViewModel
    {
        public Guid Id { get; set; }

        public string Email { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? PhoneNumber { get; set; }

        public bool IsSubscribed { get; set; }

        public ContactReasonTypes ReasonType { get; set; }

        public string? Comment { get; set; }

        public string Url { get; set; }
    }
}
