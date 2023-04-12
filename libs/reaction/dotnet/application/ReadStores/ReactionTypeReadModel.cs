using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Reaction.Domain.Aggregates;
using OpenSystem.Reaction.Domain.Events;
using OpenSystem.Reaction.Domain.ValueObjects;

namespace OpenSystem.Reaction.Application.ReadStores
{
    public class ReactionTypeReadModel : IReadModel
    {
        public ReactionTypes Type { get; set; }

        public List<ReactionTypeDetailReadModel> Details { get; } =
            new List<ReactionTypeDetailReadModel>();

        public ReactionTypeReadModel() { }

        public ReactionTypeReadModel(ReactionTypes type)
        {
            Type = type;
        }

        public void AddDetail(string userId, DateTimeOffset reactedOn)
        {
            var detail = Details.FirstOrDefault(d => d.UserId == userId);
            if (detail == null)
            {
                detail = new ReactionTypeDetailReadModel(userId, reactedOn);
                Details.Add(detail);
            }
        }

        public void RemoveDetail(string userId)
        {
            Details.RemoveAll(d => d.UserId == userId);
        }

        public void Apply(IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent> @event)
        {
            Type = @event.AggregateEvent.Type;

            var detail = Details.FirstOrDefault(d => d.UserId == @event.AggregateEvent.UserId);
            if (detail == null)
            {
                detail = new ReactionTypeDetailReadModel(
                    @event.AggregateEvent.UserId,
                    @event.Timestamp
                );
                Details.Add(detail);
            }
        }

        public void Apply(IDomainEvent<ReactionAggregate, ReactionId, ReactionRemovedEvent> @event)
        {
            Type = @event.AggregateEvent.Type;
            if (Details.Any(t => t.UserId == @event.AggregateEvent.UserId))
                RemoveDetail(@event.AggregateEvent.UserId);
        }
    }
}
