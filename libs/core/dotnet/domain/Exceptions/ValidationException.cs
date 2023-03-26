using FluentValidation.Results;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class ValidationException : BaseException
    {
        public IEnumerable<ValidationFailure>? Errors { get; init; }

        public ValidationException(IEnumerable<ValidationFailure> failures,
          string? extendedMessage = null)
          : base(typeof(ResultCodeValidation),
            ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
            extendedMessage)
        {
          Errors = failures;
        }

        public ValidationException(int resultCode,
          string? extendedMessage = null)
          : base(typeof(ResultCodeValidation),
            resultCode,
            extendedMessage)
        {
        }

        public ValidationException(Type resultType,
          int resultCode,
          string? extendedMessage = null)
          : base(resultType,
            resultCode,
            extendedMessage)
        {
        }
    }
}
