using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Exceptions;

namespace OpenSystem.Core.Infrastructure.WebApi.Middleware
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next,
          ILogger<ErrorHandlerMiddleware> logger)
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
                  case ValidationException e:
                    // custom application error
                    response.StatusCode = (int)HttpStatusCode.BadRequest;

                    errorResponse.Title = "The request has failed a server-side validation.";
                    errorResponse.Type ??= "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-badrequest";

                    if (e?.Errors != null &&
                      e.Errors.Count > 0)
                    {
                      if (!string.IsNullOrEmpty(error?.Message))
                        errorResponse.Title = error.Message;

                      errorResponse.Detail = String.Join(Literals.NewLine,
                        e.Errors.ToArray());

                      errorResponse.Fields = new List<ErrorResponseField>();
                      foreach(KeyValuePair<string, string[]> errorField in e.Errors.ToArray())
                      {
                        errorResponse.Fields.Add(new ErrorResponseField {
                          Name = errorField.Key,
                          Errors = errorField.Value.ToList(),
                        });
                      }
                    }

                    break;

                  case ForbiddenAccessException:
                    // custom application error
                    response.StatusCode = (int)HttpStatusCode.Forbidden;

                    errorResponse.Title = "The user does not have access to this resource.";
                    errorResponse.Type ??= "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-forbidden";

                    break;

                  case KeyNotFoundException:
                  case NotFoundException:
                    // not found error
                    response.StatusCode = (int)HttpStatusCode.NotFound;

                    errorResponse.Title = "The requested resource does not exist.";
                    errorResponse.Type ??= "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-notfound";

                    break;

                  case FileExportException:
                  case GeneralProcessingException:
                  default:
                    // unhandled error
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;

                    errorResponse.Title = "A generic error has occurred on the server.";
                    errorResponse.Type ??= "https://learn.microsoft.com/en-us/dotnet/api/system.net.httpstatuscode?view=net-7.0#system-net-httpstatuscode-internalservererror";

                    break;
                }

                // use ILogger to log the exception message
                _logger.LogError(error?.Message);
                _logger.LogError(errorResponse?.Title);

                await response.WriteAsync(JsonSerializer.Serialize(errorResponse));
            }
        }
    }

}
