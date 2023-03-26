using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Exceptions;
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

                var result = await _handler.Invoke(routeContext);
                response = result switch
                {
                    IVersionedIndex versionedIndex
                        => versionedIndex.EventCounter == 1
                            ? Results.Created(
                                $"{routeContext.HttpContext.Request.Path}/{versionedIndex.Id}",
                                versionedIndex
                            )
                            : Results.Ok(versionedIndex),
                    IResult finalResult => finalResult,
                    null => Results.NoContent(),
                    _ => Results.Ok(result)
                };

                if (result is IVersioned versioned)
                    routeContext.HttpContext.Response.Headers.ETag =
                        versioned.EventCounter.ToString();
                if (result is IIndexed indexed)
                    routeContext.HttpContext.Response.Headers.Location =
                        $"{routeContext.HttpContext.Request.Path}/{indexed.Id}";
            }
            catch (JsonException e)
            {
                response = Results.BadRequest();
                GetLogger(context)
                    .LogError(
                        "Failed to process JSON request for {Type}: {Message} \r\nStack Trace: {StackTrace}",
                        _type.FullName,
                        e.Message,
                        e.Demystify().StackTrace
                    );
            }
            catch (RequestBindingException e)
            {
                response = Results.BadRequest();
                GetLogger(context)
                    .LogError(
                        "Failed to process request for {Type}: {Message} \r\nStack Trace: {StackTrace}",
                        _type.FullName,
                        e.Message,
                        e.Demystify().StackTrace
                    );
            }
            catch (ValidationException e)
            {
                response = Results.ValidationProblem(
                    e.Errors
                        ?.GroupBy(e => e.PropertyName, e => e.ErrorMessage)
                        ?.ToDictionary(
                            failureGroup => failureGroup.Key,
                            failureGroup => failureGroup.ToArray()
                        ),
                    "One or more validation errors have occurred",
                    context.Request.Path,
                    Status422UnprocessableEntity
                );
                GetLogger(context)
                    .LogError(
                        "Validations failed for request {Type}: {Message} \r\nStack Trace: {StackTrace}",
                        _type.FullName,
                        e.Message,
                        e.Demystify().StackTrace
                    );
            }
            catch (NotFoundException e)
            {
                response = Results.NotFound();
                GetLogger(context)
                    .LogError(
                        "Unable to find data for request {Type}: {Message} \r\nStack Trace: {StackTrace}",
                        _type.FullName,
                        e.Message,
                        e.Demystify().StackTrace
                    );
            }
            catch (ForbiddenAccessException e)
            {
                response = Results.Unauthorized();
                GetLogger(context)
                    .LogError(
                        "User is not authorized to make request {Type}: {Message} \r\nStack Trace: {StackTrace}",
                        _type.FullName,
                        e.Message,
                        e.Demystify().StackTrace
                    );
            }
            catch (BaseException e)
            {
                response = Results.Problem(
                    e.Message,
                    context.Request.Path,
                    Status500InternalServerError
                );
                GetLogger(context)
                    .LogError(
                        "An error has occurred during request {Type}: {Message} \r\nStack Trace: {StackTrace}",
                        _type.FullName,
                        e.Message,
                        e.Demystify().StackTrace
                    );
            }
            catch (Exception e)
            {
                response = Results.Problem(
                    e.Message,
                    context.Request.Path,
                    Status500InternalServerError
                );
                GetLogger(context)
                    .LogError(
                        "An unexpected error has occurred during request {Type}: {Message} \r\nStack Trace: {StackTrace}",
                        _type.FullName,
                        e.Message,
                        e.Demystify().StackTrace
                    );
            }

            // Clear cache headers for error responses
            if (HttpUtility.IsServerError(context.Response.StatusCode))
            {
                context.Response.Headers.CacheControl = "no-cache, no-store, must-revalidate";
                context.Response.Headers.Pragma = "no-cache";
                context.Response.Headers.ETag = default;
                context.Response.Headers.Expires = "0";
            }

            await response.ExecuteAsync(context).ConfigureAwait(false);
        }

        private async ValueTask<object?> EndpointHandler(RouteHandlerInvocationContext context)
        {
            var httpContext = context.HttpContext;
            var sender = httpContext.RequestServices.GetRequiredService<ISender>();
            var request = context.Arguments[0] ?? await httpContext.BindToAsync(_type);

            return await sender.Send(request, httpContext.RequestAborted).ConfigureAwait(false);
        }
    }
}
