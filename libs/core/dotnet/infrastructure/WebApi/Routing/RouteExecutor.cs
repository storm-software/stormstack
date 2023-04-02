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
using OpenSystem.Core.Domain.ReadStores;
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
            var log = GetLogger(context);
            IResult response;

            try
            {
                var request = await context.BindToAsync(_type);

                log.LogInformation(
                    "Starting request {Type}: {Request} \r\n",
                    _type.FullName,
                    request
                );

                var routeContext = new DefaultRouteHandlerInvocationContext(context, request);

                response = (IResult)await _handler.Invoke(routeContext);
            }
            catch (Exception e)
            {
                log.LogError(
                    "An OpenSystem exception occurred while calling the mediator pipeline during request {Type}: {Message} \r\nStack Trace: {StackTrace}",
                    _type.FullName,
                    e.Message,
                    e.Demystify().StackTrace
                );
                if (e.InnerException != null && e.InnerException is Exception innerException)
                    log.LogError(
                        "Inner exception detail from request '{Type}': {Message} \r\nStack Trace: {StackTrace}",
                        _type.FullName,
                        innerException.Message,
                        innerException.Demystify().StackTrace
                    );
                log.LogDebug("{Type} Exception Details: {e}", e);

                response = HttpUtility.CreateProblem(context, e);
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

                return await HandleQueryAsync((IQuery<object>)request, httpContext);
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
            GetLogger(httpContext).LogDebug("Response received from command bus: {Result}", result);
            if (result?.Succeeded != true)
                return HttpUtility.CreateProblem(httpContext, (Result?)result);

            return HttpUtility.CreateOk(httpContext, result);
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

            var result = await _queryProcessor.ProcessAsync(query, httpContext.RequestAborted);
            if (result == null)
                return HttpUtility.CreateProblem(httpContext, result as Result, Status404NotFound);
            if (result is Result resultObj && resultObj.Failed)
                return HttpUtility.CreateProblem(httpContext, resultObj);

            return HttpUtility.CreateOk(httpContext, Result.Success(result));
        }
    }
}
