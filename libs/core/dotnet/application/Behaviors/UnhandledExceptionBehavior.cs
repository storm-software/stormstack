using MediatR;
using Serilog;

namespace OpenSystem.Core.Application.Behaviors
{
  public class UnhandledExceptionBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : MediatR.IRequest<TResponse>
  {
    private readonly ILogger _logger;

    public UnhandledExceptionBehavior(ILogger logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request,
      RequestHandlerDelegate<TResponse> next,
      CancellationToken cancellationToken)
    {
        try
        {
            return await next();
        }
        catch (Exception ex)
        {
            var requestName = typeof(TRequest).Name;

            _logger.Error(ex,
              "OpenSystem Request: Unhandled Exception for Request {Name} {@Request}",
              requestName,
              request);

            throw;
        }
    }
  }
}

