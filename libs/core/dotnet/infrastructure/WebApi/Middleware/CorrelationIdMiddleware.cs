using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Constants;
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Infrastructure.WebApi.Middleware
{
    public class CorrelationIdMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly ILogger<CorrelationIdMiddleware> _logger;

        public CorrelationIdMiddleware(
            RequestDelegate next,
            ILogger<CorrelationIdMiddleware> logger
        )
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            string? correlationId = null;

            if (
                context.Request.Headers.TryGetValue(
                    HeaderKeys.CorrelationId,
                    out StringValues correlationIds
                )
            )
            {
                correlationId = correlationIds.FirstOrDefault(
                    k => k != null && k.Equals(HeaderKeys.CorrelationId)
                );

                _logger.LogInformation($"CorrelationId from Request Header: {correlationId}");
            }
            else
            {
                correlationId = GuidUtility.Comb.CreateGuid().ToString();
                context.Request.Headers.Add(HeaderKeys.CorrelationId, correlationId);

                _logger.LogInformation($"Generated CorrelationId: {correlationId}");
            }

            context.Response.OnStarting(() =>
            {
                if (
                    !context.Response.Headers.TryGetValue(
                        HeaderKeys.CorrelationId,
                        out correlationIds
                    )
                )
                    context.Response.Headers.Add(HeaderKeys.CorrelationId, correlationId);

                return Task.CompletedTask;
            });

            using (_logger.BeginScope("{@CorrelationId}", correlationId))
                await _next.Invoke(context);
        }
    }
}
