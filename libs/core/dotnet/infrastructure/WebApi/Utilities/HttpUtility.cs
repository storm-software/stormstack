using System.Diagnostics;
using System.Text.Json;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Infrastructure.WebApi.Constants;
using Serilog;
using static Microsoft.AspNetCore.Http.StatusCodes;

namespace OpenSystem.Core.Infrastructure.Utilities
{
    public static class HttpUtility
    {
        private static HashSet<string> _allowedHeaderNames =>
            new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                HeaderNames.AccessControlAllowCredentials,
                HeaderNames.AccessControlAllowHeaders,
                HeaderNames.AccessControlAllowMethods,
                HeaderNames.AccessControlAllowOrigin,
                HeaderNames.AccessControlExposeHeaders,
                HeaderNames.AccessControlMaxAge,
                HeaderNames.StrictTransportSecurity,
                HeaderNames.WWWAuthenticate,
                HeaderKeys.CorrelationId
            };

        public static bool IsSuccessStatusCode(int? statusCode = Status404NotFound) =>
            (statusCode >= Status200OK && statusCode < Status400BadRequest);

        public static bool IsProblemStatusCode(int? statusCode = Status404NotFound) =>
            !IsSuccessStatusCode(statusCode);

        // Err on the side of caution and treat missing status code as server error.
        public static bool IsServerError(int? statusCode) =>
            !statusCode.HasValue || IsProblemStatusCode(statusCode.Value);

        public static bool IsProblem(HttpContext context)
        {
            if (!IsSuccessStatusCode(context.Response.StatusCode))
                return false;
            if (context.Response.ContentLength.HasValue)
                return false;
            if (string.IsNullOrEmpty(context.Response.ContentType))
                return true;

            return false;
        }

        public static bool ShouldIncludeDetails(
            HttpContext context,
            ErrorHandlingSettings? settings = null
        ) =>
            context.RequestServices.GetRequiredService<IHostEnvironment>().IsDevelopment()
            && settings?.ReportStack != false;

        public static int MapToStatusCode(Exception exception)
        {
            return exception switch
            {
                JsonException => Status400BadRequest,
                RequestBindingException => Status400BadRequest,
                Domain.Exceptions.ValidationException => Status400BadRequest,
                ForbiddenAccessException => Status403Forbidden,
                KeyNotFoundException => Status404NotFound,
                NotFoundException => Status404NotFound,
                _ => Status500InternalServerError
            };
        }

        public static int MapToStatusCode(Result? result)
        {
            return
                result == null
                || result.Severity == Domain.Enums.ResultSeverityTypes.Fatal
                || (
                    result.Type != typeof(ResultCodeValidation).PrettyPrint()
                    && result.Type != typeof(ResultCodeSecurity).PrettyPrint()
                )
                ? Status500InternalServerError
                : result.Type != typeof(ResultCodeSecurity).PrettyPrint()
                    ? Status403Forbidden
                    : result.Type == typeof(ResultCodeValidation).PrettyPrint()
                        ? Status400BadRequest
                        : Status500InternalServerError;
        }

        public static string GetStatusCodeUrl(
            int statusCode,
            string statusCodesUrl = "https://httpstatuses.com"
        ) => $"{statusCodesUrl.RemoveSuffix("/")}/{statusCode}";

        public static string GetStatusCodeTitle(int statusCode) =>
            ReasonPhrases.GetReasonPhrase(statusCode);

        public static string GetTraceId(HttpContext context) =>
            Activity.Current?.Id ?? context.TraceIdentifier;

        public static IResult CreateOk(
            HttpContext context,
            OpenSystem.Core.Domain.Common.IResult<object> result
        )
        {
            SetOkResponseHeaders(context, result.Data);
            return Results.Ok(result?.Data);
        }

        public static IResult CreateOk(HttpContext context, IAggregateEventResult result)
        {
            SetOkResponseHeaders(context, result.Data);
            if (result?.Data is IVersionedIndex<IIdentity> versionedIndex)
            {
                var data = new Dictionary<string, object>
                {
                    { "id", versionedIndex.Id.Value },
                    { "version", versionedIndex.Version }
                };

                if (versionedIndex.Version == 1)
                    return Results.Created($"{context.Request.Path}/{versionedIndex.Id}", data);

                return Results.Ok(data);
            }

            return Results.Ok(result?.Data);
        }

        public static IResult CreateProblem(
            HttpContext context,
            Exception exception,
            int? statusCode = null
        )
        {
            if (statusCode == null)
                statusCode = MapToStatusCode(exception);

            var baseException = exception as BaseException;
            return statusCode switch
            {
                Status400BadRequest
                    => CreateValidationProblem(
                        context,
                        exception as ValidationException,
                        statusCode
                    ),
                Status403Forbidden => CreateUnauthorized(context),
                Status404NotFound => CreateNotFound(context),
                _
                    => CreateProblem(
                        context,
                        (int)statusCode,
                        baseException?.Severity ?? ResultSeverityTypes.Error,
                        baseException?.ResultType,
                        baseException?.ResultCode,
                        baseException?.ExtendedMessage,
                        baseException?.StackTrace,
                        baseException?.HelpLink
                    )
            };
        }

        public static IResult CreateProblem(
            HttpContext context,
            Result? result = null,
            int? statusCode = null
        )
        {
            if (statusCode == null)
                statusCode = MapToStatusCode(result);

            return statusCode switch
            {
                Status400BadRequest => CreateValidationProblem(context, result, statusCode),
                Status403Forbidden => CreateUnauthorized(context),
                Status404NotFound => CreateNotFound(context),
                _
                    => CreateProblem(
                        context,
                        (int)statusCode,
                        result?.Severity ?? ResultSeverityTypes.Error,
                        result?.Type,
                        result?.Code,
                        result?.ExtendedMessage,
                        result?.StackTrace,
                        result?.HelpLink
                    )
            };
        }

        private static ILogger _log = Log.ForContext(typeof(HttpUtility));

        private static IResult CreateProblem(
            HttpContext context,
            int statusCode = Status500InternalServerError,
            ResultSeverityTypes severity = ResultSeverityTypes.Error,
            string? type = null,
            int? code = null,
            string? extendedMessage = null,
            string? stackTrace = null,
            string? helpLink = null
        )
        {
            var extensions = new Dictionary<string, object?> { { "traceId", GetTraceId(context) } };
            extensions.Add("severity", ResultSeverityTypes.Error);

            if (ShouldIncludeDetails(context))
            {
                if (!string.IsNullOrEmpty(extendedMessage))
                    extensions.Add("extendedMessage", extendedMessage);
                if (!string.IsNullOrEmpty(stackTrace))
                    extensions.Add("stackTrace", stackTrace);
            }

            SetProblemResponseHeaders(context);
            var result = Results.Problem(
                ResultCode.Serialize(
                    type != null ? type : typeof(ResultCodeGeneral).PrettyPrint(),
                    (int)(code != null ? code : ResultCodeGeneral.GeneralError)
                ),
                context.Request.Path,
                statusCode,
                GetStatusCodeTitle(statusCode),
                helpLink ?? GetStatusCodeUrl(statusCode),
                extensions
            );

            _log.Error(
                "Http {Method} error ({StatusCode}) in {Path}: {Result}",
                context.Request.Method,
                statusCode,
                context.Request.Path,
                result
            );

            return result;
        }

        private static IResult CreateValidationProblem(
            HttpContext context,
            ValidationException? exception,
            int? statusCode = null
        )
        {
            var baseException = exception as BaseException;
            return CreateValidationProblem(
                context,
                exception?.Failures,
                statusCode != null ? (int)statusCode : Status400BadRequest,
                exception?.Severity,
                baseException?.ResultType,
                baseException?.ResultCode,
                exception?.Message,
                exception?.Demystify().StackTrace,
                exception?.HelpLink
            );
        }

        private static IResult CreateValidationProblem(
            HttpContext context,
            Result? result = null,
            int? statusCode = null
        )
        {
            return CreateValidationProblem(
                context,
                result?.Failures,
                statusCode != null ? (int)statusCode : Status400BadRequest,
                result?.Severity,
                result?.Type,
                result?.Code,
                result?.ExtendedMessage,
                result?.StackTrace,
                result?.HelpLink
            );
        }

        private static IResult CreateValidationProblem(
            HttpContext context,
            List<IFieldValidationResult>? failures = null,
            int statusCode = Status400BadRequest,
            ResultSeverityTypes? severity = null,
            string? type = null,
            int? code = null,
            string? extendedMessage = null,
            string? stackTrace = null,
            string? helpLink = null
        )
        {
            var extensions = new Dictionary<string, object?> { { "traceId", GetTraceId(context) } };
            extensions.Add("severity", ResultSeverityTypes.Error);

            if (ShouldIncludeDetails(context))
            {
                if (!string.IsNullOrEmpty(extendedMessage))
                    extensions.Add("extendedMessage", extendedMessage);
                if (!string.IsNullOrEmpty(stackTrace))
                    extensions.Add("stackTrace", stackTrace);
            }

            SetProblemResponseHeaders(context);
            var result = Results.ValidationProblem(
                failures
                    ?.GroupBy(e => e.FieldName, e => ResultCode.Serialize(e.Type, e.Code))
                    ?.ToDictionary(
                        failureGroup => failureGroup.Key,
                        failureGroup => failureGroup.ToArray()
                    ),
                ResultCode.Serialize(
                    type != null ? type : typeof(ResultCodeValidation).PrettyPrint(),
                    (int)(
                        code != null
                            ? code
                            : ResultCodeValidation.OneOrMoreValidationFailuresHaveOccurred
                    )
                ),
                context.Request.Path,
                statusCode,
                GetStatusCodeTitle(statusCode),
                helpLink ?? GetStatusCodeUrl(statusCode),
                extensions
            );

            _log.Error(
                "Http {Method} validation error ({StatusCode}) in {Path}: {Result}",
                context.Request.Method,
                statusCode,
                context.Request.Path,
                result
            );

            return result;
        }

        private static IResult CreateNotFound(HttpContext context)
        {
            return CreateProblem(
                context,
                Status404NotFound,
                ResultSeverityTypes.Error,
                typeof(ResultCodeApplication).PrettyPrint(),
                ResultCodeApplication.NoResultsFound
            );
        }

        private static IResult CreateUnauthorized(HttpContext context)
        {
            return CreateProblem(
                context,
                Status401Unauthorized,
                ResultSeverityTypes.Error,
                typeof(ResultCodeSecurity).PrettyPrint(),
                ResultCodeSecurity.ForbiddenAccess
            );
        }

        private static void SetResponseHeaders(HttpContext context)
        {
            context.Response.Headers.RequestId = HttpUtility.GetTraceId(context);
        }

        private static void SetOkResponseHeaders(HttpContext context, object? data = null)
        {
            if (data != null)
            {
                if (data is IVersioned versioned)
                    context.Response.Headers.ETag = versioned.Version.ToString();
                if (data is IIndexed<IIdentity> indexed)
                    context.Response.Headers.Location = $"{context.Request.Path}/{indexed.Id}";

                context.Response.Headers.LastModified = DateTimeOffset.UtcNow.ToString("G");
            }

            context.Response.ContentType = HttpContentTypeConstants.Json;
            SetResponseHeaders(context);
        }

        private static void SetProblemResponseHeaders(HttpContext context)
        {
            // Because the CORS middleware adds all the headers early in the pipeline,
            // we want to copy over the existing Access-Control-* headers after resetting the response.
            var headers = context.Response.Headers
                .Where(h => _allowedHeaderNames.Contains(h.Key))
                .ToDictionary(h => h.Key, h => h.Value);

            context.Response.Headers.Clear();
            foreach (var header in headers)
                context.Response.Headers.Add(header);

            context.Response.Headers.CacheControl = "no-cache, no-store, must-revalidate";
            context.Response.Headers.Pragma = "no-cache";
            context.Response.Headers.ETag = default;
            context.Response.Headers.Expires = "0";

            context.Response.ContentType = HttpContentTypeConstants.ProblemJson;
            SetResponseHeaders(context);
        }
    }
}
