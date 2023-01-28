using OpenSystem.Core.DotNet.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.User.Domain.Enums;
using OpenSystem.Core.DotNet.Domain.ValueObjects;
using System.Globalization;

namespace OpenSystem.User.Domain.Entities
{
    public class User : StringIndexedAuditableEntity
    {
        public string UserId { get; set; }

        public string Name { get; set; }

        public UserTypes Type { get; set; }

        public UserStatusTypes Status { get; set; }

        public string? Description { get; set; }

        public EmailAddress Email { get; set; }

        public CultureInfo Culture { get; set; }
    }
}
