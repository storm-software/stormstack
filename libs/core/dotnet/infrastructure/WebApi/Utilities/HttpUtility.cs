using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using static Microsoft.AspNetCore.Http.StatusCodes;

namespace OpenSystem.Core.Infrastructure.Utilities
{
    public static class HttpUtility
    {
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

        public static int MapToStatusCode(Exception exception)
        {
            return exception switch
            {
                Domain.Exceptions.ValidationException => Status422UnprocessableEntity,
                ForbiddenAccessException => Status403Forbidden,
                KeyNotFoundException => Status404NotFound,
                NotFoundException => Status404NotFound,
                _ => Status500InternalServerError
            };
        }

        public static int MapToStatusCode(Result result)
        {
            return result.Severity == Domain.Enums.ResultSeverityTypes.Fatal
                ? Status500InternalServerError
                : Status422UnprocessableEntity;
        }
    }
}
