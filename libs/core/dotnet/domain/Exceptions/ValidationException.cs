using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.Exceptions
{
    public class ValidationException : BaseException
    {
        public List<IFieldValidationResult>? Failures { get; init; }

        public ValidationException(
            IEnumerable<IFieldValidationResult> failures,
            string? extendedMessage = null
        )
            : base(
                typeof(ResultCodeValidation),
                ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
                extendedMessage
            )
        {
            Failures = failures.ToList();
        }

        public ValidationException(
            int resultCode,
            IEnumerable<IFieldValidationResult>? failures = null,
            string? extendedMessage = null
        )
            : this(typeof(ResultCodeValidation), resultCode, extendedMessage)
        {
            Failures = failures?.ToList();
        }

        public ValidationException(int resultCode, string? extendedMessage = null)
            : base(typeof(ResultCodeValidation), resultCode, extendedMessage) { }

        public ValidationException(Type resultType, int resultCode, string? extendedMessage = null)
            : base(resultType, resultCode, extendedMessage) { }
    }
}
