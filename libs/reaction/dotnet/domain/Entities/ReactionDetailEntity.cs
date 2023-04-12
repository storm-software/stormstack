using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Reaction.Domain.ValueObjects;
using System.Globalization;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Reaction.Domain.Entities
{
    public class ReactionDetailEntity : Entity<UserId>
    {
        public ReactionTypes Type { get; set; }

        public ReactionDetailEntity(UserId userId, ReactionTypes type)
            : base()
        {
            Id = userId;
            Type = type;
        }

        public ReactionDetailEntity(string userId, ReactionTypes type)
            : this(UserId.With(userId), type) { }
    }
}
