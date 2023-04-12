using OpenSystem.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.Extensions;
using System.Globalization;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Reaction.Domain.Events;
using OpenSystem.Reaction.Domain.Entities;
using Akka.Persistence.Query;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Reaction.Domain.Aggregates;

namespace OpenSystem.Reaction.Application.ReadStores
{
    public class ReactionReadModel : IReadModel
    {
        public string ReactionId { get; set; }

        public bool IsDisabled { get; set; } = false;

        public List<ReactionTypeReadModel> Types { get; set; } = new List<ReactionTypeReadModel>();

        public ReactionReadModel(string reactionId)
        {
            ReactionId = reactionId;
        }
    }
}
