using FluentValidation;
using MediatR;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Commands;

namespace OpenSystem.Core.Application.Behaviors
{
    public class ValidationBehavior<TRequest> : IPipelineBehavior<TRequest, IAggregateEventResult>
        where TRequest : class, ICommand
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;

        private readonly ILogger<ValidationBehavior<TRequest>> _logger;

        public ValidationBehavior(
            IEnumerable<IValidator<TRequest>> validators,
            ILogger<ValidationBehavior<TRequest>> logger
        )
        {
            _validators = validators;
            _logger = logger;
        }

        /*public async Task<TResponse> Handle(TRequest request,
          RequestHandlerDelegate<TResponse> next,
          CancellationToken cancellationToken)
        {
          if (_validators.Any())
          {
            var context = new ValidationContext<TRequest>(request);
            var validationResults = await Task.WhenAll(
              _validators.Select(validator =>
                validator.ValidateAsync(context,
                  cancellationToken)));

            var failures = validationResults.Where(result => result.Errors.Any())
              .SelectMany(result =>
                result.Errors)
              .Where(result => result != null)
              .ToList();
            if (failures.Count > 0)
            {
              var result = Result.Failure(typeof(ResultCodeValidation),
                ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred);

              failures.ForEach(failure => {
                if (!Enum.TryParse(typeof(ResultSeverityTypes),
                   failure.Severity.ToString(),
                   true,
                   out object? severity))
                   severity = ResultSeverityTypes.Error;

                result.AddField(failure.PropertyName,
                  typeof(ResultCodeValidation),
                  int.Parse(failure.ErrorCode),
                  failure.AttemptedValue,
                  (ResultSeverityTypes)severity,
                  failure.ErrorMessage,
                  null,
                  failure.FormattedMessagePlaceholderValues);
              });

              throw (TResponse)result;
            }
          }

          return await next();
        }*/

        public async Task<IAggregateEventResult> Handle(
            TRequest request,
            RequestHandlerDelegate<IAggregateEventResult> next,
            CancellationToken cancellationToken
        )
        {
            if (_validators.Any())
            {
                _logger.LogDebug("Validating request {RequestName}", typeof(TRequest).Name);

                var context = new ValidationContext<TRequest>(request);
                var validationResults = await Task.WhenAll(
                    _validators.Select(
                        validator => validator.ValidateAsync(context, cancellationToken)
                    )
                );

                var failures = validationResults
                    .Where(result => result.Errors.Any())
                    .SelectMany(result => result.Errors)
                    .ToList();
                if (failures.Any())
                {
                    _logger.LogError(
                        "Validation errors - {RequestName} {@ValidationErrors}",
                        typeof(TRequest).Name,
                        failures
                    );

                    return (IAggregateEventResult)
                        Result<IVersionedIndex>.Failure(
                            failures
                                .Select(
                                    failure =>
                                        FieldValidationResult.Failure(
                                            failure.PropertyName,
                                            typeof(ResultCodeValidation),
                                            int.TryParse(failure.ErrorCode, out int code)
                                                ? code
                                                : ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred,
                                            failure.AttemptedValue,
                                            failure.ErrorMessage
                                        )
                                )
                                .ToList(),
                            "The request failed one or more application-level validations"
                        );
                }

                _logger.LogDebug(
                    "Request {RequestName} validated successfully",
                    typeof(TRequest).Name
                );
            }

            return await next();
        }
    }
}
