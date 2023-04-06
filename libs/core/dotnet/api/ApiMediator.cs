using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Commands;
using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Api.ModelBinding;
using OpenSystem.Core.Api.Utilities;
using static Microsoft.AspNetCore.Http.StatusCodes;

namespace OpenSystem.Core.Api
{
    public class ApiMediator
    {
        private readonly Type _type;

        private readonly EndpointRouteHandler _handler;

        public ApiMediator(Type type, IEnumerable<RouteHandlerFilterAttribute> filters)
        {
            _type = type;
            var action = new EndpointRouteHandler(EndpointHandler);
            foreach (var item in filters)
                action = new FilterEndpointRouteHandler(item.InvokeAsync, action.Invoke);

            _handler = action;
        }

        protected static ILogger<ApiMediator> GetLogger(HttpContext context) =>
            context.RequestServices.GetRequiredService<ILogger<ApiMediator>>();

        public async Task Handle(HttpContext context)
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

        protected virtual async ValueTask<IResult> HandleCommandAsync(
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

        protected virtual async ValueTask<IResult> HandleQueryAsync(
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
    }
}
