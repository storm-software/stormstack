using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.DotNet.Application.Models.DTOs;
using OpenSystem.Core.DotNet.Application.Models.Parameters;
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

                var errorDetails = new ErrorDetails()
                {
                  Detail = error?.Message,
                  Instance = context.Request?.Path
                };

                switch (error)
                {
                    case ApiException:
                        // custom application error
                        response.StatusCode = (int)HttpStatusCode.BadRequest;

                        errorDetails.Title = "The request could not be understood by the server";
                        errorDetails.Type = "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-badrequest";

                        break;

                    case ValidationException e:
                        // custom application error
                        response.StatusCode = (int)HttpStatusCode.BadRequest;

                        errorDetails.Title = "An invalid request has been sent to the server";
                        errorDetails.Type = "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-badrequest";
                        errorDetails.Errors = e.Errors;

                        break;

                    case KeyNotFoundException:
                        // not found error
                        response.StatusCode = (int)HttpStatusCode.NotFound;

                        errorDetails.Title = "The requested resource does not exist on the server";
                        errorDetails.Type = "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-notfound";

                        break;

                    default:
                        // unhandled error
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        errorDetails.Title = "A generic error has occurred on the server";
                        errorDetails.Type = "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-internalservererror";

                        break;
                }

                var Result = new Result<ErrorDetails>()
                {
                  Succeeded = false,
                  Message = errorDetails.Title,
                  Errors = errorDetails
                };

                // use ILogger to log the exception message
                _logger.LogError(error?.Message);

                await response.WriteAsync(JsonSerializer.Serialize(Result));
            }
        }
    }

}
