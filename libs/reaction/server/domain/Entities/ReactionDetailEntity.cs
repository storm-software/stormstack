using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Reaction.Domain.ValueObjects;
using System.Globalization;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Reaction.Domain.Entities
{
    public class ReactionDetailEntity : Entity<ReactionDetailId>
    {
        public ReactionTypes Type { get; set; }

        public ReactionId ReactionId { get; set; }

        public int Count { get; set; } = 0;

        public ReactionDetailEntity(ReactionTypes type, ReactionId reactionId)
            : base()
        {
            Type = type;
            ReactionId = reactionId;
        }
    }
}
