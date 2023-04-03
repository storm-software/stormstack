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
using OpenSystem.Reaction.Domain.ResultCodes;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Reaction.Domain.Aggregates;

namespace OpenSystem.Reaction.Application.ReadStores
{
    public class ReactionReadModel
        : IReadModel,
            IReadModelFor<ReactionAggregate, ReactionId, ReactionAddedEvent>,
            IReadModelFor<ReactionAggregate, ReactionId, ReactionRemovedEvent>
    {
        public string Id { get; set; }

        public string ReactionId { get; set; }

        public bool IsDisabled { get; set; } = false;

        public List<ReactionDetailEntity> Details { get; set; } = new List<ReactionDetailEntity>();

        /*public void Apply(ReactionAddedEvent @event)
        {
            var detail = _details.FirstOrDefault(d => d.Type == @event.Type);
            if (detail == null)
            {
                detail = new ReactionDetailEntity(@event.Type, Id);
                _details.Add(detail);
            }

            detail.Count++;
        }

        public void Apply(ReactionRemovedEvent @event)
        {
            var detail = _details.FirstOrDefault(d => d.Type == @event.Type);
            if (detail == null)
            {
                detail = new ReactionDetailEntity(@event.Type, Id);
                _details.Add(detail);
            }

            detail.Count--;
        }*/

        public Task ApplyAsync(
            IReadModelContext context,
            IDomainEvent<ReactionAggregate, ReactionId, ReactionAddedEvent> @event,
            CancellationToken cancellationToken
        )
        {
            Id = context.ReadModelId;
            ReactionId = @event.AggregateIdentity.Value;

            var detail = Details.FirstOrDefault(d => d.Type == @event.AggregateEvent.Type);
            if (detail == null)
            {
                detail = new ReactionDetailEntity(
                    @event.AggregateEvent.Type,
                    @event.AggregateIdentity
                );
                Details.Add(detail);
            }

            detail.Count++;

            return Task.CompletedTask;
        }

        public Task ApplyAsync(
            IReadModelContext context,
            IDomainEvent<ReactionAggregate, ReactionId, ReactionRemovedEvent> @event,
            CancellationToken cancellationToken
        )
        {
            Id = context.ReadModelId;
            ReactionId = @event.AggregateIdentity.Value;

            var detail = Details.FirstOrDefault(d => d.Type == @event.AggregateEvent.Type);
            if (detail == null)
            {
                detail = new ReactionDetailEntity(
                    @event.AggregateEvent.Type,
                    @event.AggregateIdentity
                );
                Details.Add(detail);
            }

            detail.Count--;

            return Task.CompletedTask;
        }
    }
}
