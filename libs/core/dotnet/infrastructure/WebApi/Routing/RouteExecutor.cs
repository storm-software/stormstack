using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using OpenSystem.Core.Application.Commands;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Infrastructure.ModelBinding;
using OpenSystem.Core.Infrastructure.Utilities;
using static Microsoft.AspNetCore.Http.StatusCodes;

namespace OpenSystem.Core.Infrastructure.Routing
{
    internal sealed class RouteExecutor
    {
        private readonly Type _type;

        private readonly EndpointRouteHandler _handler;

        internal RouteExecutor(Type type, IEnumerable<RouteHandlerFilterAttribute> filters)
        {
            _type = type;
            var action = new EndpointRouteHandler(EndpointHandler);
            foreach (var item in filters)
                action = new FilterEndpointRouteHandler(item.InvokeAsync, action.Invoke);

            _handler = action;
        }

        private static ILogger<RouteExecutor> GetLogger(HttpContext context) =>
            context.RequestServices.GetRequiredService<ILogger<RouteExecutor>>();

        internal async Task Handle(HttpContext context)
        {
            IResult response;
            try
            {
                var request = await context.BindToAsync(_type);
                var routeContext = new DefaultRouteHandlerInvocationContext(context, request);

                response = (IResult)await _handler.Invoke(routeContext);
            }
            catch (Exception e)
            {
                response = HttpUtility.CreateProblem(context, e);

                var log = GetLogger(context);
                log.LogError(
                    "An error has occurred during request {Type}: {Message} \r\nStack Trace: {StackTrace}",
                    _type.FullName,
                    e.Message,
                    e.Demystify().StackTrace
                );
                log.LogDebug("{Type} Exception Details: {e}", e);
            }

            if (response != null)
                await response.ExecuteAsync(context).ConfigureAwait(false);
        }

        private async ValueTask<object?> EndpointHandler(RouteHandlerInvocationContext context)
        {
            var httpContext = context.HttpContext;
            var request = context.Arguments[0] ?? await httpContext.BindToAsync(_type);
            if (
                string.Equals(httpContext.Request.Method, "GET", StringComparison.OrdinalIgnoreCase)
            )
            {
                if (!(request is IQuery<object> query))
                    return HttpUtility.CreateProblem(
                        httpContext,
                        Result.Failure(
                            typeof(ResultCodeApplication),
                            ResultCodeApplication.InvalidRequestSentToServer
                        ),
                        Status400BadRequest
                    );

                return await HandleQueryAsync(query, httpContext);
            }
            else
            {
                if (!(request is ICommand command))
                    return HttpUtility.CreateProblem(
                        httpContext,
                        Result.Failure(
                            typeof(ResultCodeApplication),
                            ResultCodeApplication.InvalidRequestSentToServer
                        ),
                        Status400BadRequest
                    );

                return await HandleCommandAsync(command, httpContext);
            }
        }

        private async ValueTask<IResult> HandleCommandAsync(
            ICommand command,
            HttpContext httpContext
        )
        {
            var _commandBus = httpContext.RequestServices.GetRequiredService<ICommandBus>();
            if (_commandBus == null)
                return HttpUtility.CreateProblem(
                    httpContext,
                    Result.Failure(
                        typeof(ResultCodeApplication),
                        ResultCodeApplication.MissingMediator
                    )
                );

            var result = await command.PublishAsync(_commandBus, httpContext.RequestAborted);
            if (result?.Succeeded != true)
                return HttpUtility.CreateProblem(httpContext, result as AggregateEventResult);

            return HttpUtility.CreateOk(httpContext, (IResult<object>)result);
        }

        private async ValueTask<IResult> HandleQueryAsync(
            IQuery<object> query,
            HttpContext httpContext
        )
        {
            var _queryProcessor = httpContext.RequestServices.GetRequiredService<IQueryProcessor>();
            if (_queryProcessor == null)
                return HttpUtility.CreateProblem(
                    httpContext,
                    Result.Failure(
                        typeof(ResultCodeApplication),
                        ResultCodeApplication.MissingMediator
                    )
                );

            var ret = await _queryProcessor.ProcessAsync<object>(query, httpContext.RequestAborted);
            if (!(ret is Result result) || result.Failed)
                return HttpUtility.CreateProblem(httpContext, ret as Result);

            return HttpUtility.CreateOk(httpContext, result);
        }
    }
}
