using OpenSystem.Core.Domain.Settings;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Reflection;
using OpenSystem.Core.Api.ModelBinding;
using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Api.Middleware;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Api.Services;

namespace OpenSystem.Core.Api.Extensions
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddCoreMiddleware(this IServiceCollection services)
        {
            services.AddTransient<ICurrentUserService, CurrentUserService>();
            services.AddHttpContextAccessor();

            //Configure CORS to allow any origin, header and method.
            //Change the CORS policy based on your requirements.
            //More info see: https://docs.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-3.0
            services.AddCors();

            // Add Anti-CSRF/XSRF services
            return services.AddAntiforgery();
        }

        public static IApplicationBuilder UseCoreMiddleware(this IApplicationBuilder app)
        {
            return app.UseCorrelationIdMiddleware().UseSecurityMiddleware();
        }

        public static IApplicationBuilder UseCorrelationIdMiddleware(this IApplicationBuilder app)
        {
            return app.UseMiddleware<CorrelationIdMiddleware>();
        }

        public static IApplicationBuilder UseSecurityMiddleware(this IApplicationBuilder app)
        {
            return app.UseSecurityHeaders().UseMiddleware<AntiforgeryMiddleware>();
        }

        /*public static void AddVersionedApiExplorerExtension(this IServiceCollection services)
        {
            services.AddVersionedApiExplorer(o =>
            {
                o.GroupNameFormat = "'v'VVV";
                o.SubstituteApiVersionInUrl = true;
            });
        }

        public static void AddApiVersioningExtension(this IServiceCollection services)
        {
            services.AddApiVersioning(config =>
            {
                // Specify the default API Version as 1.0
                config.DefaultApiVersion = new ApiVersion(1, 0);
                // If the client hasn't specified the API version in the request, use the default API version number
                config.AssumeDefaultVersionWhenUnspecified = true;
                // Advertise the API versions supported for the particular endpoint
                config.ReportApiVersions = true;
            });
        }*/
    }
}
