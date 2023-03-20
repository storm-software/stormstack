using OpenSystem.Core.Application.Interfaces;
using System.Diagnostics;
using MediatR;
using OpenSystem.Core.Application.Services;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Core.Application.Behaviors
{
  public class PerformanceBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : MediatR.IRequest<TResponse>
  {
    private readonly Stopwatch _timer;

    private readonly ILogger<PerformanceBehavior<TRequest, TResponse>> _logger;

    private readonly ICurrentUserService _currentUserService;

    //private readonly IIdentityService _identityService;

    public PerformanceBehavior(
        ILogger<PerformanceBehavior<TRequest, TResponse>> logger,
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

            _logger.LogWarning("Long Running Request: {Name} ({ElapsedMilliseconds} milliseconds) {@UserId} {@UserName} {@Request}",
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

