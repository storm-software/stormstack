using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Core.Domain.ValueObjects;
using System.Globalization;

namespace OpenSystem.Core.Domain.Entities
{
    public class AddressEntity
      : Entity<Guid>
    {
        public string? AddressLine1 { get; set; }

        public string? AddressLine2 { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? CountryCode { get; set; }

        public string? PostalCode { get; set; }
    }
}
