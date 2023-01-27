using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.DotNet.Application.Models.DTOs;
using OpenSystem.Core.DotNet.Domain.Constants;
using OpenSystem.Core.DotNet.Application.Exceptions;
using OpenSystem.Core.DotNet.Application.Models;

namespace OpenSystem.Core.DotNet.WebApi.Middleware
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                var response = context.Response;
                response.ContentType = "application/json";

                var errorResponse = new ErrorResponse()
                {
                  Detail = error?.Message,
                  Type = error?.HelpLink,
                  Instance = context.Request?.Path
                };

                switch (error)
                {
                    case ApiException:
                        // custom application error
                        response.StatusCode = (int)HttpStatusCode.BadRequest;

                        errorResponse.Title = "The request could not be understood by the server";
                        errorResponse.Type ??= "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-badrequest";

                        break;

                    case ValidationException e:
                        // custom application error
                        response.StatusCode = (int)HttpStatusCode.BadRequest;

                        errorResponse.Title = "An invalid request has been sent to the server";
                        errorResponse.Type ??= "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-badrequest";

                        if (e.Errors != null &&
                          e.Errors.Count > 0)
                        {
                          if (!string.IsNullOrEmpty(error?.Message))
                            errorResponse.Title = error.Message;

                          errorResponse.Detail = String.Join(Literals.NewLine,
                            e.Errors.ToArray());
                        }

                        break;

                    case KeyNotFoundException:
                        // not found error
                        response.StatusCode = (int)HttpStatusCode.NotFound;

                        errorResponse.Title = "The requested resource does not exist on the server";
                        errorResponse.Type ??= "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-notfound";

                        break;

                    default:
                        // unhandled error
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        errorResponse.Title = "A generic error has occurred on the server";
                        errorResponse.Type ??= "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-internalservererror";

                        break;
                }

                // use ILogger to log the exception message
                _logger.LogError(error?.Message);

                await response.WriteAsync(JsonSerializer.Serialize(errorResponse));
            }
        }
    }

}
