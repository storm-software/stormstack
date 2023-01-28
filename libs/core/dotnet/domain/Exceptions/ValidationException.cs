using FluentValidation.Results;
using OpenSystem.Core.DotNet.Domain.Extensions;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Domain.Exceptions
{
    public class ValidationException : BaseException
    {
        public IDictionary<string, string[]> Errors { get; }

        public ValidationException()
          : base(typeof(ResultCodeValidation),
            ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred)
        {
          Errors = new Dictionary<string, string[]>();
        }

        public ValidationException(Type? resultCodeType,
          int code)
          : base((resultCodeType == null
            ? typeof(ResultCodeValidation)
            : resultCodeType),
              (!code.IsSet()
            ? ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred
            : code))
        {
          Errors = new Dictionary<string, string[]>();
        }

        public ValidationException(Type? resultCodeType,
          int code,
          Exception exception)
            : base(resultCodeType,
                code,
                exception)
        {
          Errors = new Dictionary<string, string[]>();
        }

        public ValidationException(Exception exception)
            : base(typeof(ResultCodeValidation),
                ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
                exception)
        {
          Errors = new Dictionary<string, string[]>();
        }

        public ValidationException(IEnumerable<ValidationFailure> failures)
          : base(typeof(ResultCodeValidation),
            ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred)
        {
            Errors = failures
            .GroupBy(e => e.PropertyName,
              e => e.ErrorMessage)
            .ToDictionary(failureGroup => failureGroup.Key,
              failureGroup => failureGroup.ToArray());
        }
    }
}
