using FluentValidation;
using OpenSystem.Reaction.Application.Interfaces;
using OpenSystem.Reaction.Application.Models;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.Reaction.Application.Validators
{
    public class AddReactionCommandValidator : AbstractValidator<AddReactionCommand>
    {
        private readonly IReactionRepository _repository;

        public AddReactionCommandValidator(IReactionRepository repository)
        {
            _repository = repository;

            RuleFor(reaction => reaction.ContentId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .NotNull()
                .WithMessage("{PropertyName} is required.")
                .MustAsync(UserHasReactedAsync)
                .WithMessage("User has already reacted to this content.");

            RuleFor(reaction => reaction.Type)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .NotNull()
                .WithMessage("{PropertyName} is required.");
        }

        private async Task<bool> UserHasReactedAsync(string contentId,
          CancellationToken cancellationToken)
        {
            return await _repository.UserHasReactedAsync(contentId);
        }
    }
}


