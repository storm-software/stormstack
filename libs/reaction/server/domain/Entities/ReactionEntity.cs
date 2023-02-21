using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;
using System.Globalization;

namespace OpenSystem.Reaction.Domain.Entities
{
    public class ReactionEntity
      : AuditableEntity<Guid>, IAggregateRoot
    {
        public string ContentId { get; set; }

        public IList<ReactionDetailEntity> Details { get; set; } = new List<ReactionDetailEntity>();
    }
}
