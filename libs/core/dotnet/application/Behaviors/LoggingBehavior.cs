using OpenSystem.Core.Application.Interfaces;
using MediatR.Pipeline;
using OpenSystem.Core.Application.Services;
using Microsoft.Extensions.Logging;

namespace OpenSystem.Core.Application.Behaviors
{
  public class LoggingBehavior<TRequest>
    : IRequestPreProcessor<TRequest>
    where TRequest : notnull
  {
    private readonly ILogger<LoggingBehavior<TRequest>> _logger;

    private readonly ICurrentUserService _currentUserService;

    //private readonly IIdentityService _identityService;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest>> logger,
      ICurrentUserService currentUserService)
    {
        _logger = logger;
        _currentUserService = currentUserService;
        //_identityService = identityService;
    }

    public async Task Process(TRequest request,
      CancellationToken cancellationToken)
    {
      var requestName = typeof(TRequest).Name;
      var userId = _currentUserService.UserId ?? string.Empty;
      string? userName = string.Empty;

      if (!string.IsNullOrEmpty(userId))
      {
          //userName = await _identityService.GetUserNameAsync(userId);
      }

      _logger.LogInformation("Processing Request: {Name} {@UserId} {@UserName} {@Request}",
          requestName,
          userId,
          userName,
          request);

      await Task.CompletedTask;
    }
  }
}
