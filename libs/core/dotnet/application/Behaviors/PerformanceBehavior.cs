using OpenSystem.Core.Application.Interfaces;
using System.Diagnostics;
using MediatR;
using Serilog;
using OpenSystem.Core.Application.Services;

namespace OpenSystem.Core.Application.Behaviors
{
  public class PerformanceBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : MediatR.IRequest<TResponse>
  {
    private readonly Stopwatch _timer;

    private readonly ILogger _logger;

    private readonly ICurrentUserService _currentUserService;

    //private readonly IIdentityService _identityService;

    public PerformanceBehavior(
        ILogger logger,
        ICurrentUserService currentUserService)
    {
        _timer = new Stopwatch();

        _logger = logger;
        _currentUserService = currentUserService;
        //_identityService = identityService;
    }

    public async Task<TResponse> Handle(TRequest request,
      RequestHandlerDelegate<TResponse> next,
      CancellationToken cancellationToken)
    {
        _timer.Start();

        var response = await next();

        _timer.Stop();

        var elapsedMilliseconds = _timer.ElapsedMilliseconds;

        if (elapsedMilliseconds > 500)
        {
            var requestName = typeof(TRequest).Name;
            var userId = _currentUserService.UserId ?? string.Empty;
            var userName = string.Empty;

            if (!string.IsNullOrEmpty(userId))
            {
                //userName = await _identityService.GetUserNameAsync(userId);
            }

            _logger.Warning("OpenSystem Long Running Request: {Name} ({ElapsedMilliseconds} milliseconds) {@UserId} {@UserName} {@Request}",
                requestName,
                elapsedMilliseconds,
                userId,
                userName,
                request);
        }

        return response;
    }
  }
}

