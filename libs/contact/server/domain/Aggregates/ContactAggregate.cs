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

namespace OpenSystem.Contact.Domain.Aggregates
{
    public class ContactAggregate
        : AggregateRoot<ContactAggregate, ReactionId>,
            IEmit<ReactionAddedEvent>,
            IEmit<ReactionRemovedEvent>
    {
        private bool _isDisabled = false;

        private string _email;

        private string? _firstName;

        private string? _lastName;

        private string? _phoneNumber;

        private bool _isSubscribed;

        public ContactAggregate(ContactId id)
            : base(id) { }

        public IAggregateEventResult AddContact(ReactionTypes type)
        {
            if (_isDisabled)
                return AggregateEventResult.Failure(
                    typeof(ResultCodeReaction),
                    ResultCodeReaction.ReactionsAreDisabled,
                    $"Reactions for {Id.Value} have been temporarily disabled"
                );

            Emit(new ReactionAddedEvent(type));

            return AggregateEventResult.Success(Id, Version);
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

            return AggregateEventResult.Success(Id, Version);
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
