using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;
using System.Globalization;

namespace OpenSystem.Reaction.Domain.Entities
{
    public class ReactionDetailEntity
      : AuditableEntity, ISoftDeleted
    {
        public ReactionTypes Type { get; set; }

        public string UserId { get; set; }

        public Guid ReactionId { get; set; }

        public ReactionEntity Reaction { get; set; }

        public string? DeletedBy { get; set; }

        public DateTimeOffset? DeletedDateTime { get; set; }
  }
}
