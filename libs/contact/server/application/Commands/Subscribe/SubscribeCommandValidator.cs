using FluentValidation;
using OpenSystem.Contact.Application.Interfaces;
using OpenSystem.Contact.Application.Models;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.Contact.Application.Commands.Subscribe
{
    public class SubscribeCommandValidator : AbstractValidator<SubscribeCommand>
    {
        private readonly IContactRepository _contactRepository;

        public SubscribeCommandValidator(IContactRepository contactRepository)
        {
            _contactRepository = contactRepository;

            RuleFor(contact => contact.Email)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .NotNull()
                .MaximumLength(50)
                .MustAsync(IsUniqueEmailAsync)
                .WithMessage("{PropertyName} Address is already subscribed.")
                .WithMessage("{PropertyName} must not exceed 50 characters.")
                .EmailAddress();
        }

        private async Task<bool> IsUniqueEmailAsync(string email,
          CancellationToken cancellationToken)
        {
            return await _contactRepository.IsUniqueEmailAsync(email);
        }
    }
}


