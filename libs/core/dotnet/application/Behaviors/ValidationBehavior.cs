using OpenSystem.Core.Domain.Exceptions;
using FluentValidation;
using MediatR;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Application.Behaviors
{
  public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : CommandResult<IIndexed>
  {
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(TRequest request,
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
          var result = CommandResult.Failure(typeof(ResultCodeValidation),
            ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred);


          failures.ForEach(failure => {
            if (!Enum.TryParse(typeof(FieldValidationSeverityTypes),
               failure.Severity.ToString(),
               true,
               out object? severity))
               severity = FieldValidationSeverityTypes.Error;

            result.AddField(failure.PropertyName,
              typeof(ResultCodeValidation),
              int.Parse(failure.ErrorCode),
              (FieldValidationSeverityTypes)severity);
          });

          return (TResponse)result;
        }
      }

      return await next();
    }
  }
}
