using OpenSystem.Core.Domain.Exceptions;
using FluentValidation;
using MediatR;

namespace OpenSystem.Core.Application.Behaviors
{
    public class ValidationBehavior<TRequest, TResponse>
      : IPipelineBehavior<TRequest, TResponse>
      where TRequest : IRequest<TResponse>
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
                    throw new Domain.Exceptions.ValidationException(failures);
                    //failures.First().

                    }
            }

            return await next();
        }
    }
}
