using OpenSystem.Reaction.Domain.Enums;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Reaction.Domain.ValueObjects;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Reaction.Domain.Events;
using OpenSystem.Reaction.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;
using OpenSystem.Reaction.Domain.Entities;

namespace OpenSystem.Reaction.Domain.Aggregates
{
    public class ReactionAggregate
        : AggregateRoot<ReactionAggregate, ReactionId>,
            IEmit<ReactionAddedEvent>,
            IEmit<ReactionRemovedEvent>
    {
        private bool _isDisabled = false;

        private Dictionary<string, ReactionDetailEntity> _details =
            new Dictionary<string, ReactionDetailEntity>();

        public ReactionAggregate(ReactionId id)
            : base(id) { }

        public Result AddReaction(UserId userId, ReactionTypes type)
        {
            if (_isDisabled)
                return Result.Failure(
                    typeof(ResultCodeReaction),
                    ResultCodeReaction.ReactionsAreDisabled,
                    $"Reactions for {Id.Value} have been temporarily disabled"
                );
            if (string.IsNullOrEmpty(userId?.Value))
                return Result.Failure(
                    typeof(ResultCodeApplication),
                    ResultCodeApplication.UserIdNotFound,
                    $"The User Id could not be found"
                );
            if (_details.ContainsKey(userId.Value))
                return Result.Failure(
                    typeof(ResultCodeReaction),
                    ResultCodeReaction.ReactionAlreadyExists,
                    $"A reaction to content '{Id.Value}' is already saved for {userId}"
                );

            Emit(new ReactionAddedEvent(userId.Value, type));

            return Result.Success(Id, Version);
        }

        public Result RemoveReaction(UserId userId)
        {
            if (_isDisabled)
                return Result.Failure(
                    typeof(ResultCodeReaction),
                    ResultCodeReaction.ReactionsAreDisabled,
                    $"Reactions for {Id.Value} have been temporarily disabled"
                );
            if (string.IsNullOrEmpty(userId?.Value))
                return Result.Failure(
                    typeof(ResultCodeApplication),
                    ResultCodeApplication.UserIdNotFound,
                    $"The User Id could not be found"
                );
            if (!_details.ContainsKey(userId.Value))
                return Result.Failure(
                    typeof(ResultCodeReaction),
                    ResultCodeReaction.NoReactionsExist,
                    $"There is no reaction to content '{Id.Value}' that can be removed for {userId}"
                );

            Emit(new ReactionRemovedEvent(userId.Value, _details[userId.Value].Type));

            return Result.Success(Id, Version);
        }

        public void Apply(ReactionAddedEvent @event)
        {
            _details.Add(@event.UserId, new ReactionDetailEntity(@event.UserId, @event.Type));
        }

        public void Apply(ReactionRemovedEvent @event)
        {
            _details.Remove(@event.UserId);
        }
    }
}
