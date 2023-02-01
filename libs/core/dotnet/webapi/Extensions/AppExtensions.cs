using Microsoft.AspNetCore.Builder;
using OpenSystem.Core.WebApi.Middleware;

namespace OpenSystem.Core.WebApi.Extensions
{
    public static class AppExtensions
    {
        public static void UseErrorHandlingMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ErrorHandlerMiddleware>();
        }
    }
}
