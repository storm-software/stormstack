using OpenSystem.Core.Domain.Settings;
using Consul;
using Ocelot;
using Ocelot.Provider.Consul;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Linq;

namespace OpenSystem.Core.Infrastructure.Extensions
{
   public static class ServiceDiscoverySettingsExtensions
    {
       public static IServiceCollection AddServiceDiscovery(this IServiceCollection services,
          IConfiguration configuration)
        {
            var settings = new ServiceDiscoverySettings();

            configuration.GetSection(nameof(ServiceDiscoverySettings)).Bind(settings);
            services.Configure<ServiceDiscoverySettings>(configuration.GetSection(nameof(ServiceDiscoverySettings)));

            services.AddSingleton<IConsulClient, ConsulClient>(p =>
              new ConsulClient(config =>
            {
                config.Address = settings.DiscoveryAddress;
            }));
            services.AddSingleton(settings);

            return services;
        }

        public static IApplicationBuilder UseServiceDiscovery(this IApplicationBuilder app,
          IHostApplicationLifetime lifetime)
        {
            // Retrieve Consul client from DI
            var consulClient = app.ApplicationServices
              .GetRequiredService<IConsulClient>();
            var settings = app.ApplicationServices
              .GetRequiredService<IOptions<ServiceDiscoverySettings>>();

            // Setup logger
            var loggingFactory = app.ApplicationServices
              .GetRequiredService<ILoggerFactory>();
            var logger = loggingFactory.CreateLogger<IApplicationBuilder>();

            // Get server IP address
            var address = settings.Value.Address;
            if (string.IsNullOrWhiteSpace(address))
            {
              var features = app.Properties["server.Features"] as FeatureCollection;
              if (features != null)
              {
                address = features.Get<IServerAddressesFeature>()
                  .Addresses
                  .First();

                logger.LogInformation($"Could not find service address in config. Using '{address}'");
              }
            }

            // Register service with consul
            var uri = new Uri(address);
            var name = settings.Value.Name ??
              AppDomain.CurrentDomain.FriendlyName.Trim().Trim('_');
            var registration = new AgentServiceRegistration
            {
                ID = name,
                Name = name,
                Address = uri.Host,
                Port = uri.Port,
                Tags = settings.Value.Tags
            };

            if (!settings.Value.DisableAgentCheck ||
              !string.IsNullOrWhiteSpace(settings.Value.HealthCheckEndPoint))
            {
                registration.Check = new AgentServiceCheck
                {
                    DeregisterCriticalServiceAfter = TimeSpan.FromMinutes(1),
                    Interval = TimeSpan.FromSeconds(30),
                    HTTP = new Uri(uri,
                      settings.Value.HealthCheckEndPoint).OriginalString
                };
            }

            logger.LogInformation($"Registering {name} with Consul");
            consulClient.Agent.ServiceDeregister(registration.ID).Wait();
            consulClient.Agent.ServiceRegister(registration).Wait();

            lifetime.ApplicationStopping.Register(() =>
            {
                logger.LogInformation($"De-registering {name} from Consul");
                consulClient.Agent.ServiceDeregister(registration.ID).Wait();
            });

            return app;
        }
    }
}
