using FluentValidation;
//using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Reaction.Application.Models;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.Reaction.Application.Validators
{
    /*public class RemoveReactionCommandValidator : BaseValidator<RemoveReactionCommand>
    {
        private readonly IReactionReadOnlyRepository _repository;

        public RemoveReactionCommandValidator(IReactionReadOnlyRepository repository)
        {
            _repository = repository;

            RuleFor(reaction => reaction.ContentId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .MustAsync(UserHasReactedAsync)
                .WithMessage("User has not previously reacted to this content.");
        }

        private async Task<bool> UserHasReactedAsync(
            string contentId,
            CancellationToken cancellationToken
        )
        {
            return await _repository.UserHasReactedAsync(contentId);
        }
    }*/
}
