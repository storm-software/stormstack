using Microsoft.AspNetCore.Builder;
using OpenSystem.Core.DotNet.WebApi.Middleware;

namespace OpenSystem.Core.DotNet.WebApi.Extensions
{
    public static class AppExtensions
    {
        public static void UseErrorHandlingMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ErrorHandlerMiddleware>();
        }
    }
}
