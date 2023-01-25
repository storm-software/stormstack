using OpenSystem.Core.DotNet.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.User.Domain.Enums;
using OpenSystem.Shared.Domain.ValueObjects;
using System.Globalization;

namespace OpenSystem.User.Domain.Entities
{
    public class User : AuditableBaseEntity<EntityId>
    {
        public string UserId { get; set; }

        public string Name { get; set; }

        public UserTypes type { get; set; }

        public string? Description { get; set; }

        public EmailAddress Email { get; set; }

        public CultureInfo culture { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PositionSalary { get; set; }
    }
}
