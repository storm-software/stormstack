using System.Diagnostics;
using MediatR;
using MediatR.Pipeline;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Core.Application.Behaviors
{
    public class UnhandledExceptionBehavior<TRequest, TResponse>
        : IRequestExceptionHandler<TRequest, TResponse>
        where TRequest : IBaseRequest<TResponse>
    {
        private readonly ILogger<UnhandledExceptionBehavior<TRequest, TResponse>> _logger;

        public UnhandledExceptionBehavior(
            ILogger<UnhandledExceptionBehavior<TRequest, TResponse>> logger
        )
        {
            _logger = logger;
        }

        public Task Handle(
            TRequest request,
            Exception exception,
            RequestExceptionHandlerState<TResponse> state,
            CancellationToken cancellationToken
        )
        {
            _logger.LogError(
                exception.Demystify(),
                "Failed Request: Unhandled Exception for Request {Name} {@Request}",
                typeof(TRequest).Name,
                request
            );

            return Task.CompletedTask;
        }
    }
}
