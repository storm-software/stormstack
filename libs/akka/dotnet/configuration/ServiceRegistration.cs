using Akka.Configuration;
using Akka.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using Akka.Persistence.Azure;
using Akka.Persistence.Hosting;
using Akka.Remote.Hosting;
using Akka.Cluster.Hosting;
using Akka.Management.Cluster.Bootstrap;
using Akka.Discovery.Azure;
using Akka.Cluster.Sharding;
using Akka.Management;
using OpenSystem.Akka.Configuration.Extensions;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Akka.Configuration
{
    public static class ServiceRegistration
    {
        public static AkkaConfigurationBuilder ConfigureActorSystem(
            this AkkaConfigurationBuilder builder,
            IServiceProvider sp
        )
        {
            var settings = sp.GetRequiredService<AkkaSettings>();

            return builder
                .ConfigureLoggers(configBuilder =>
                {
                    configBuilder.LogConfigOnStart = settings.LogConfigOnStart;
                    configBuilder.AddLoggerFactory();
                })
                .ConfigureNetwork(sp);
        }

        public static AkkaConfigurationBuilder ConfigureNetwork(
            this AkkaConfigurationBuilder builder,
            IServiceProvider serviceProvider
        )
        {
            var settings = serviceProvider.GetRequiredService<AkkaSettings>();
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            if (!settings.UseClustering)
                return builder;

            var b = builder.WithRemoting(settings.RemoteOptions);
            if (settings.AkkaManagementOptions is { Enabled: true })
            {
                // need to delete seed-nodes so Akka.Management will take precedence
                var clusterOptions = settings.ClusterOptions;
                clusterOptions.SeedNodes = Array.Empty<string>();

                b = b.WithClustering(clusterOptions)
                    .WithAkkaManagement(
                        hostName: settings.AkkaManagementOptions.Hostname,
                        settings.AkkaManagementOptions.Port
                    )
                    .WithClusterBootstrap(
                        serviceName: settings.AkkaManagementOptions.ServiceName,
                        portName: settings.AkkaManagementOptions.PortName,
                        requiredContactPoints: settings
                            .AkkaManagementOptions
                            .RequiredContactPointsNr
                    );

                switch (settings.AkkaManagementOptions.DiscoveryMethod)
                {
                    case DiscoveryMethod.Kubernetes:
                        break;
                    case DiscoveryMethod.AwsEcsTagBased:
                        break;
                    case DiscoveryMethod.AwsEc2TagBased:
                        break;
                    case DiscoveryMethod.AzureTableStorage:
                    {
                        var connectionStringName = configuration
                            .GetSection("AzureStorageSettings")
                            .Get<AzureStorageSettings>()
                            ?.ConnectionStringName;
                        Debug.Assert(
                            connectionStringName != null,
                            nameof(connectionStringName) + " != null"
                        );
                        var connectionString = configuration.GetConnectionString(
                            connectionStringName
                        );

                        b = b.WithAzureDiscovery(options =>
                        {
                            options.ServiceName = settings.AkkaManagementOptions.ServiceName;
                            options.ConnectionString = connectionString;
                        });
                        break;
                    }
                    case DiscoveryMethod.Config:
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
            else
            {
                b = b.WithClustering(settings.ClusterOptions);
            }

            return b;
        }

        public static IServiceCollection AddAkkaEventSourcing(
            this IServiceCollection serviceCollection
        )
        {
            // serviceCollection.AddMemoryCache();


            serviceCollection.AddTransient(typeof(IAggregateFactory), typeof(AggregateFactory));

            serviceCollection.AddSingleton(typeof(IDomainEventFactory), typeof(DomainEventFactory));

            serviceCollection.AddSingleton(typeof(IReadModelFactory<>), typeof(ReadModelFactory<>));

            return serviceCollection;
        }
    }
}
