using FluentValidation;
using OpenSystem.User.Application.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.User.Application.Commands.CreateUser
{
    public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
    {
        private readonly IUserRepository _userRepository;

        public CreateUserCommandValidator(IUserRepository userRepository)
        {
            _userRepository = userRepository;

            RuleFor(user => user.UserId)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .NotNull()
                .MaximumLength(50)
                .WithMessage("{PropertyName} must not exceed 50 characters.")
                .MustAsync(IsUniqueUserIdAsync)
                .WithMessage("{PropertyName} already exists.");

            RuleFor(user => user.Name)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .NotNull()
                .MaximumLength(50)
                .WithMessage("{PropertyName} must not exceed 50 characters.");

            RuleFor(user => user.Description)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .NotNull()
                .MaximumLength(200)
                .WithMessage("{PropertyName} must not exceed 200 characters.");

            RuleFor(user => user.Email)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .NotNull()
                .MaximumLength(50)
                .WithMessage("{PropertyName} must not exceed 50 characters.")
                .EmailAddress();

            RuleFor(user => user.Culture)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .NotNull()
                .MaximumLength(50)
                .WithMessage("{PropertyName} must not exceed 50 characters.");
        }

        private async Task<bool> IsUniqueUserIdAsync(string userId,
          CancellationToken cancellationToken)
        {
            return await _userRepository.IsUniqueUserIdAsync(userId);
        }
    }
}


