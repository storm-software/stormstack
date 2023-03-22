using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenSystem.Core.Application.Models.DTOs;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using static Microsoft.AspNetCore.Http.StatusCodes;

namespace OpenSystem.Core.Application.Utilities
{
  public static class HttpUtility
  {
        public static bool IsSuccessStatusCode(int? statusCode = Status404NotFound) => (statusCode >= Status200OK && 
      statusCode < Status400BadRequest);

    public static bool IsProblemStatusCode(int? statusCode = Status404NotFound) => !IsSuccessStatusCode(statusCode);

    // Err on the side of caution and treat missing status code as server error.
    public static bool IsServerError(int? statusCode) => !statusCode.HasValue || statusCode.Value >= 500;

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

    public static string GetStatusCodeUrl(int statusCode) => $"https://httpstatuses.com/{statusCode}";

    public static string GetStatusCodeTitle(int statusCode) => ReasonPhrases.GetReasonPhrase(statusCode); 

    public static string GetTraceId(HttpContext context) => Activity.Current?.Id ?? context.TraceIdentifier;

    public static bool IncludeErrorDetails(HttpContext context) => context
      .RequestServices
      .GetRequiredService<IHostEnvironment>()
      .IsDevelopment(); 
  }
}

