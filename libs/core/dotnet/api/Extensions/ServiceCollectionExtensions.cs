using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.Services;
using OpenSystem.Core.Infrastructure.Persistence;
using OpenSystem.Core.Infrastructure.Services;
using OpenSystem.Core.Domain.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OpenSystem.Core.Infrastructure.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using OpenSystem.Core.Domain.Constants;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Builder;
using OpenSystem.Core.Infrastructure.WebApi.Middleware;
using System.Text.Json;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Mvc;
using OpenSystem.Core.Infrastructure.WebApi.Constants;
using System.Security.Claims;
using IdentityModel;
using OpenSystem.Core.Infrastructure.Persistence.Interceptors;
using OpenSystem.Core.Infrastructure.WebApi.Formatters;
using OpenSystem.Core.Infrastructure.WebApi.Services;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Reflection;
using OpenSystem.Core.Infrastructure.ModelBinding;
using OpenSystem.Core.Application.Models;
using OpenSystem.Core.Application.Utilities;

namespace OpenSystem.Core.Api.Extensions
{
    public static class ServiceRegistration
    {
        /// <summary>
        /// Add Mediator to a service collection.
        /// </summary>
        /// <param name="services">Service collection</param>
        /// <param name="configure">Configure MinimatR options</param>
        /// <param name="configureParsers">Register additional parser for custom type</param>
        /// <returns></returns>
        /// <exception cref="NullReferenceException"></exception>
        public static IServiceCollection AddMediator(
            this IServiceCollection services,
            Action<MediatorSettings> configure,
            Action<ObjectParserCollection>? configureParsers = null
        )
        {
            services.Configure<MediatorSettings>(config =>
            {
                configure(config);
                if (config.Assembly is null)
                {
                    throw new NullReferenceException("Assembly must be set");
                }
            });

            return AddMediatorParsers(services, configureParsers);
        }

        /// <summary>
        /// Add Mediator to a service collection.
        /// </summary>
        /// <param name="services">Service collection</param>
        /// <param name="assembly">Assembly to scan</param>
        /// <param name="configure">Configure Mediator options</param>
        /// <param name="configureParsers">Register additional parser for custom type</param>
        /// <returns></returns>
        public static IServiceCollection AddMediator(
            this IServiceCollection services,
            Assembly? assembly = null,
            Action<MediatorSettings>? configure = null,
            Action<ObjectParserCollection>? configureParsers = null
        )
        {
            assembly ??= Assembly.GetCallingAssembly();
            services.Configure<MediatorSettings>(configuration =>
            {
                configuration.Assembly ??= assembly;
                configure?.Invoke(configuration);
            });

            return AddMediatorParsers(services, configureParsers);
        }

        private static IServiceCollection AddMediatorParsers(
            IServiceCollection services,
            Action<ObjectParserCollection>? configureParsers
        )
        {
            if (
                services
                    .FirstOrDefault(d => d.ServiceType == typeof(ObjectParserCollection))
                    ?.ImplementationInstance
                is not ObjectParserCollection parserCollection
            )
            {
                parserCollection = new ObjectParserCollection();
                services.TryAddSingleton(parserCollection);
            }

            configureParsers?.Invoke(parserCollection);
            ModelBinder.AddDefaultParsers(parserCollection);
            return services;
        }

        //Configure CORS to allow any origin, header and method.
        //Change the CORS policy based on your requirements.
        //More info see: https://docs.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-3.0
        public static IServiceCollection AddCorsMiddleware(this IServiceCollection services)
        {
            return services.AddCors();
        }

        public static IApplicationBuilder UseCorrelationIdMiddleware(this IApplicationBuilder app)
        {
            return app.UseMiddleware<CorrelationIdMiddleware>();
        }

        public static IApplicationBuilder UseSecurityInfrastructure(this IApplicationBuilder app)
        {
            return app.UseSecurityHeaders().UseMiddleware<AntiforgeryMiddleware>();
        }

        public static void AddVersionedApiExplorerExtension(this IServiceCollection services)
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
        }
    }
}
