using OpenSystem.Core.Application.Interfaces;
using MediatR.Pipeline;
using OpenSystem.Core.Application.Services;
using Microsoft.Extensions.Logging;
using MediatR;
using Microsoft.Extensions.Hosting;

namespace OpenSystem.Core.Application.Behaviors
{
    public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IBaseRequest<TResponse>
    {
        private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

        private readonly ICurrentUserService _currentUserService;

        //private readonly IIdentityService _identityService;

        private readonly IHostEnvironment _hostEnvironment;

        public LoggingBehavior(
            ILogger<LoggingBehavior<TRequest, TResponse>> logger,
            ICurrentUserService currentUserService,
            IHostEnvironment hostEnvironment
        )
        {
            _logger = logger;
            _currentUserService = currentUserService;
            _hostEnvironment = hostEnvironment;

            //_identityService = identityService;
        }

        public async Task<TResponse> Handle(
            TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken
        )
        {
            var requestName = typeof(TRequest).Name;
            var userId = _currentUserService.UserId ?? string.Empty;
            var userName = string.Empty;

            if (!string.IsNullOrEmpty(userId))
            {
                //userName = await _identityService.GetUserNameAsync(userId);
            }

            _logger.LogInformation(
                "Starting Request: {Name} {@UserId} {@UserName} {@Request}",
                requestName,
                userId,
                userName,
                request
            );

            if (_hostEnvironment.IsDevelopment())
                request
                    .GetType()
                    .GetProperties()
                    .Where(p => p.PropertyType == typeof(string))
                    .ToList()
                    .ForEach(
                        p =>
                            _logger.LogDebug(
                                "{Name} ({Type}): {@Value}",
                                p.Name,
                                p.PropertyType.Name,
                                p.GetValue(request, null)?.ToString()?.Trim()
                            )
                    );

            var response = await next();

            _logger.LogInformation(
                "Completing Request: {Name} {@UserId} {@UserName} {@Response}",
                requestName,
                userId,
                userName,
                response
            );

            if (_hostEnvironment.IsDevelopment())
                response
                    ?.GetType()
                    .GetProperties()
                    .Where(p => p.PropertyType == typeof(string))
                    .ToList()
                    .ForEach(
                        p =>
                            _logger.LogDebug(
                                "{Name} ({Type}): {@Value}",
                                p.Name,
                                p.PropertyType.Name,
                                p.GetValue(request, null)?.ToString()?.Trim()
                            )
                    );

            return response;
        }
    }
}
