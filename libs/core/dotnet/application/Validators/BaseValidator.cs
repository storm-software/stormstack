using FluentValidation;
using FluentValidation.Results;

namespace OpenSystem.Reaction.Application.Validators
{
    public abstract class BaseValidator<TRequest> : AbstractValidator<TRequest>
        where TRequest : notnull
    {
        protected sealed override bool PreValidate(
            ValidationContext<TRequest> context,
            ValidationResult result
        )
        {
            if (context.InstanceToValidate == null)
            {
                result.Errors.Add(
                    new ValidationFailure("", "No request payload was supplied to the server.")
                );
                return false;
            }

            return InnerPreValidate(context, result);
        }

        protected virtual bool InnerPreValidate(
            ValidationContext<TRequest> context,
            ValidationResult result
        )
        {
            return true;
        }
    }
}
