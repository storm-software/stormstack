using FluentValidation;
//using OpenSystem.Reaction.Domain.Repositories;
using OpenSystem.Reaction.Application.Models;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation.Results;

namespace OpenSystem.Reaction.Application.Validators
{
    /*public class AddReactionCommandValidator : BaseValidator<AddReactionCommand>
    {
        private readonly IReactionReadOnlyRepository _repository;

        public AddReactionCommandValidator(IReactionReadOnlyRepository repository)
        {
            _repository = repository;

            RuleFor(reaction => reaction.ContentId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .MustAsync(UserHasntReactedAsync)
                .WithMessage("User has already reacted to this content.");

            RuleFor(reaction => reaction.Payload)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.");

        }

        private async Task<bool> UserHasntReactedAsync(
            string contentId,
            CancellationToken cancellationToken
        )
        {
            return !(await _repository.UserHasReactedAsync(contentId));
        }

        protected override bool InnerPreValidate(
            ValidationContext<AddReactionCommand> context,
            ValidationResult result
        )
        {
            if (context.InstanceToValidate?.Payload == null)
            {
                result.Errors.Add(
                    new ValidationFailure("", "No request payload was supplied to the server.")
                );
                return false;
            }

            return true;
        }
    }*/
}
