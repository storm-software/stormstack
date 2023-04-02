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
using OpenSystem.Core.Domain.Attributes;

namespace OpenSystem.Reaction.Domain.Aggregates
{
    public class ReactionAggregate
        : AggregateRoot<ReactionAggregate, ReactionId>,
            IEmit<ReactionAddedEvent>,
            IEmit<ReactionRemovedEvent>
    {
        private bool _isDisabled = false;

        private List<ReactionDetailEntity> _details = new List<ReactionDetailEntity>();

        public ReactionAggregate(ReactionId id)
            : base(id) { }

        public IAggregateEventResult AddReaction(ReactionTypes type)
        {
            if (_isDisabled)
                return AggregateEventResult.Failure(
                    typeof(ResultCodeReaction),
                    ResultCodeReaction.ReactionsAreDisabled,
                    $"Reactions for {Id.Value} have been temporarily disabled"
                );

            Emit(new ReactionAddedEvent(type));

            return AggregateEventResult.Success();
        }

        public IAggregateEventResult RemoveReaction(ReactionTypes type)
        {
            if (_isDisabled)
                return AggregateEventResult.Failure(
                    typeof(ResultCodeReaction),
                    ResultCodeReaction.ReactionsAreDisabled,
                    $"Reactions for {Id.Value} have been temporarily disabled"
                );

            var detail = _details.FirstOrDefault(d => d.Type == type);
            if (detail != null && detail.Count <= 0)
                return AggregateEventResult.Failure(
                    typeof(ResultCodeReaction),
                    ResultCodeReaction.NoReactionsExist,
                    $"There are no {type} reactions for {Id.Value} that can be removed"
                );

            Emit(new ReactionRemovedEvent(type));

            return AggregateEventResult.Success();
        }

        public void Apply(ReactionAddedEvent @event)
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
        }
    }
}
