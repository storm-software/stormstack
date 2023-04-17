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

        public void Apply(IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent> @event)
        {
            var type = Types.FirstOrDefault(d => d.Type == @event.AggregateEvent.Type);
            if (type == null)
            {
                type = new ReactionTypeReadModel();
                Types.Add(type);
            }

            type.Apply(@event);
        }

        public void Apply(IDomainEvent<ReactionAggregate, ReactionId, ReactionRemovedEvent> @event)
        {
            var type = Types.FirstOrDefault(d => d.Type == @event.AggregateEvent.Type);
            if (type == null)
            {
                type = new ReactionTypeReadModel();
                Types.Add(type);
            }

            type.Apply(@event);
        }
    }
}
