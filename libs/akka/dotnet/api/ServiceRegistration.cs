using Akka.HealthCheck.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Akka.Hosting;
using System.Diagnostics;
using Akka.HealthCheck.Hosting.Web;
using OpenSystem.Akka.Configuration;
using OpenSystem.Akka.Configuration.Extensions;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Api.Extensions;

namespace OpenSystem.Akka.Api
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddAkkaApi(
            this IServiceCollection services,
            IConfiguration configuration,
            Action<AkkaConfigurationBuilder, IServiceProvider> configureActors
        )
        {
            services.AddProblemDetails();
            services.AddCoreMiddleware();
            services.AddAkkaEventSourcing();

            services.WithAkkaHealthCheck(HealthCheckType.All);
            services.ConfigureAkkaApi(
                configuration,
                (akkaConfigurationBuilder, serviceProvider) =>
                {
                    // we configure instrumentation separately from the internals of the ActorSystem
                    configureActors(akkaConfigurationBuilder, serviceProvider);
                    akkaConfigurationBuilder.ConfigurePetabridgeCmd();
                    akkaConfigurationBuilder.WithWebHealthCheck(serviceProvider);
                }
            );

            return services;
        }

        public static IServiceCollection ConfigureAkkaApi(
            this IServiceCollection services,
            IConfiguration configuration,
            Action<AkkaConfigurationBuilder, IServiceProvider> configureActors
        )
        {
            var akkaSettings = configuration.GetRequiredSection("AkkaSettings").Get<AkkaSettings>();
            Debug.Assert(akkaSettings != null, nameof(akkaSettings) + " != null");

            services.AddSingleton(akkaSettings);
            return services.AddAkka(
                akkaSettings.ActorSystemName,
                (builder, sp) =>
                {
                    configureActors(builder, sp);
                }
            );
        }
    }
}
