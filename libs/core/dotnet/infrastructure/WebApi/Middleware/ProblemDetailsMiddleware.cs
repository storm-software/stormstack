using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Domain.Constants;
using OpenSystem.Core.Domain.Common;
using System.Diagnostics;
using OpenSystem.Core.Infrastructure.WebApi.Extensions;
using Microsoft.AspNetCore.Diagnostics;
using OpenSystem.Core.Infrastructure.WebApi.Constants;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.AspNetCore.Http.StatusCodes;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.ResultCodes;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.Net.Http.Headers;
using OpenSystem.Core.Application.Extensions;
using OpenSystem.Core.Application.Services;
using Microsoft.AspNetCore.Builder;
using System.Runtime.ExceptionServices;

namespace OpenSystem.Core.Infrastructure.WebApi.Middleware
{
    public class ProblemDetailsMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly ILogger<ProblemDetailsMiddleware> _logger;

        private readonly DiagnosticListener _diagnosticListener;

        private readonly IProblemDetailsResponseFactory _factory;

        private const string DiagnosticListenerKey = "Microsoft.AspNetCore.Diagnostics.HandledException";

        private IActionResultExecutor<ObjectResult> _executor { get; }

        private static readonly RouteData _emptyRouteData = new();

        private static readonly ActionDescriptor _emptyActionDescriptor = new();

        public ProblemDetailsMiddleware(RequestDelegate next,
          IActionResultExecutor<ObjectResult> executor,
          IProblemDetailsResponseFactory factory,
          ILogger<ProblemDetailsMiddleware> logger,
          DiagnosticListener diagnosticListener)
        {
            _next = next;
            _executor = executor;
            _factory = factory;

            _logger = logger;
             _diagnosticListener = diagnosticListener;
        }

      public async Task InvokeAsync(HttpContext context)
      {
        ExceptionDispatchInfo? edi = null;

        var stopWatch = Stopwatch.StartNew();
        var requestBody = await context.Request.GetRequestBodyAsync();
        var originalResponseBodyStream = context.Response.Body;
        bool isRequestSuccessful = false;

        using var memoryStream = new MemoryStream();

        try
        {
            context.Response.Body = memoryStream;
            await _next.Invoke(context);

            if (context.Response.HasStarted)
            {
              _logger.LogWarning("The response has already started, the ProblemDetails middleware will not be executed");
              return;
            }

            var bodyAsText = await ReadResponseBodyStreamAsync(memoryStream);
            context.Response.Body = originalResponseBodyStream;
            if (context.Response.StatusCode != Status304NotModified &&
              context.Response.StatusCode != Status204NoContent)
            {
                if (bodyAsText.IsHtml() &&
                  context.Response.StatusCode == Status200OK)
                  context.Response.StatusCode = Status404NotFound;

                isRequestSuccessful = HttpUtility.IsSuccessStatusCode(context.Response.StatusCode);
                if (isRequestSuccessful)
                  await context.WriteResponseAsync(bodyAsText);
            }

            if (!isRequestSuccessful)
              await SendProblemDetailsAsync(context,
                await _factory.CreateProblemDetailsAsync(context,
                  Result.Failure(typeof(ResultCodeGeneral),
                    ResultCodeGeneral.GeneralError)));
        }
        catch (Exception ex)
        {
          if (context.Response.HasStarted)
              _logger.ResponseStarted();

          try
          {
            edi = ExceptionDispatchInfo.Capture(ex);
            if (edi != null)
            {
                var error = edi.SourceException;
                var feature = new ExceptionHandlerFeature
                {
                    Path = context.Request.Path,
                    Error = error,
                };

                ClearResponse(context,
                  StatusCodes.Status500InternalServerError);

                context.Features.Set<IExceptionHandlerPathFeature>(feature);
                context.Features.Set<IExceptionHandlerFeature>(feature);

                var problemDetails = await _factory.CreateExceptionProblemDetailsAsync(context,
                  error);
                if (problemDetails != null)
                {
                  await SendProblemDetailsAsync(context,
                    problemDetails);
                }
              }

              _logger.LogError("An exception has been thrown.");
            }
            catch (Exception inner)
            {
                // If we fail to write a problem response, we log the exception and throw the original below.
                // _logger.ProblemDetailsMiddlewareException(inner);
            }
        }
      }

      public ExceptionHandlerOptions exceptionHandlerOptions = new ExceptionHandlerOptions
      {
          AllowStatusCode404Response = true,
          ExceptionHandler = async (HttpContext context) =>
          {
              // The default exception handler always responds with status code 500 so we're overriding here to
              // allow pass-through status codes from BadHttpRequestException.
              // GitHub issue to support this in framework: https://github.com/dotnet/aspnetcore/issues/43831
              var exceptionHandlerFeature = context.Features.Get<IExceptionHandlerFeature>();
              var error = exceptionHandlerFeature?.Error;

              var response = context.Response;
              response.ContentType = HttpContentTypeConstants.Json;



              var errorResponse = new ErrorResponse()
              {
                Detail = error?.Message,
                Type = error?.HelpLink,
                Instance = context.Request?.Path
              };


              if (context.Request.AcceptsJson()
                  && context
                    .RequestServices
                    .GetRequiredService<IProblemDetailsService>() is { } problemDetailsService)
              {
                  // Write as JSON problem details
                  await problemDetailsService.WriteAsync(new()
                  {
                      HttpContext = context,
                      AdditionalMetadata = exceptionHandlerFeature?.Endpoint?.Metadata,
                      ProblemDetails = { Status = context.Response.StatusCode }
                  });
              }
              else
              {
                  context.Response.ContentType = HttpContentTypeConstants.Text;
                  string message = ReasonPhrases.GetReasonPhrase(context.Response.StatusCode);


                  await context.Response.WriteAsync(message + "\r\n");
                  await context.Response.WriteAsync($"Request ID: {Activity.Current?.Id ??
                    context.TraceIdentifier}");
              }

              // use ILogger to log the exception message
              //_logger.LogError(error?.Message);
              //_logger.LogError(errorResponse?.Title);

              await context.Response.WriteAsync(JsonSerializer.Serialize(new ErrorResponse()
              {
                Detail = "error?.Message",
                Type = "error?.HelpLink",
                Instance = context.Request?.Path
              }));
          }
      };



    public async Task SendProblemDetailsAsync(HttpContext context,
      ProblemDetailsResponse problemDetails)
    {
        ClearResponse(context,
          context.Response.StatusCode);

        await _executor.ExecuteAsync(new ActionContext(context,
          context.GetRouteData() ?? _emptyRouteData,
          _emptyActionDescriptor),
          _factory.GetObjectResult(context,
            problemDetails));
          await context.Response.CompleteAsync();
    }

    private void ClearResponse(HttpContext context,
      int statusCode)
        {
            var headers = new HeaderDictionary();

            // Make sure problem responses are never cached.
            headers[HeaderNames.CacheControl] = "no-cache, no-store, must-revalidate";
            headers[HeaderNames.Pragma] = "no-cache";
            headers[HeaderNames.ETag] = default;
            headers[HeaderNames.Expires] = "0";

            foreach (var header in context.Response.Headers)
            {
                // Because the CORS middleware adds all the headers early in the pipeline,
                // we want to copy over the existing Access-Control-* headers after resetting the response.
                if (AllowedHeaderNames.Contains(header.Key))
                {
                    headers.Add(header);
                }
            }

            context.Response.Clear();
            context.Response.StatusCode = statusCode;

            foreach (var header in headers)
            {
                context.Response.Headers.Add(header);
            }
        }

       private HashSet<string> AllowedHeaderNames => new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            HeaderNames.AccessControlAllowCredentials,
            HeaderNames.AccessControlAllowHeaders,
            HeaderNames.AccessControlAllowMethods,
            HeaderNames.AccessControlAllowOrigin,
            HeaderNames.AccessControlExposeHeaders,
            HeaderNames.AccessControlMaxAge,
            HeaderNames.StrictTransportSecurity,
            HeaderNames.WWWAuthenticate,
        };

        /*public async Task Invoke(HttpContext context)
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
        }*/


        private async Task<string> ReadResponseBodyStreamAsync(Stream bodyStream)
        {
            bodyStream.Seek(0, SeekOrigin.Begin);
            var responseBody = await new StreamReader(bodyStream).ReadToEndAsync();
            bodyStream.Seek(0, SeekOrigin.Begin);

            var (IsEncoded, ParsedText) = responseBody.VerifyBodyContent();

            return IsEncoded ? ParsedText : responseBody;
        }
    }

}
