using FluentValidation;
using OpenSystem.Contact.Application.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.Contact.Application.Commands.CreateContact
{
    public class CreateContactCommandValidator : AbstractValidator<CreateContactCommand>
    {
        private readonly IContactRepository _contactRepository;

        public CreateContactCommandValidator(IContactRepository contactRepository)
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

            RuleFor(contact => contact.FirstName)
                .MaximumLength(100)
                .WithMessage("{PropertyName} must not exceed 100 characters.");

            RuleFor(contact => contact.LastName)
                .MaximumLength(100)
                .WithMessage("{PropertyName} must not exceed 100 characters.");

            RuleFor(contact => contact.PhoneNumber)
                .MaximumLength(20)
                .WithMessage("{PropertyName} must not exceed 20 characters.")
                .Matches("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$")
                .WithMessage("{PropertyName} has an invalid format.");

            RuleFor(contact => contact.Url)
                .MaximumLength(200)
                .WithMessage("{PropertyName} must not exceed 200 characters.");

            RuleFor(contact => contact.Comment)
                .MaximumLength(10000)
                .WithMessage("{PropertyName} must not exceed 10000 characters.");
        }

        private async Task<bool> IsUniqueEmailAsync(string email,
          CancellationToken cancellationToken)
        {
            return await _contactRepository.IsUniqueEmailAsync(email);
        }
    }
}


