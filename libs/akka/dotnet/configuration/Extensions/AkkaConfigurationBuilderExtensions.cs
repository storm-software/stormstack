using System.Diagnostics;
using Akka.Configuration;
using Akka.Hosting;
using Akka.Persistence.Azure;
using Akka.Persistence.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Petabridge.Cmd.Cluster;
using Petabridge.Cmd.Cluster.Sharding;
using Petabridge.Cmd.Host;
using Petabridge.Cmd.Remote;

namespace OpenSystem.Akka.Configuration.Extensions
{
    public static class AkkaConfigurationBuilderExtensions
    {
        /*public static AkkaConfigurationBuilder ConfigurePersistence(
            this AkkaConfigurationBuilder builder,
            IServiceProvider serviceProvider
        )
        {
            var settings = serviceProvider.GetRequiredService<AkkaSettings>();
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();

            switch (settings.PersistenceMode)
            {
                case PersistenceMode.InMemory:
                    return builder.WithInMemoryJournal().WithInMemorySnapshotStore();
                case PersistenceMode.Azure:
                {
                    var connectionStringName = configuration
                        .GetSection("AzureStorageSettings")
                        .Get<AzureStorageSettings>()
                        ?.ConnectionStringName;
                    Debug.Assert(
                        connectionStringName != null,
                        nameof(connectionStringName) + " != null"
                    );
                    var connectionString = configuration.GetConnectionString(connectionStringName);
                    Debug.Assert(connectionString != null, nameof(connectionString) + " != null");

                    // return builder.WithAzurePersistence(); // doesn't work right now
                    return builder.AddHocon(
                        GetPersistenceHocon(connectionString)
                            .WithFallback(AzurePersistence.DefaultConfig),
                        HoconAddMode.Append
                    );
                }
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public static Config GetPersistenceHocon(string connectionString)
        {
            return $@"
            akka.persistence {{
                journal {{
                    plugin = ""akka.persistence.journal.azure-table""

                    azure-table {{
                        class = ""Akka.Persistence.Azure.Journal.AzureTableStorageJournal, Akka.Persistence.Azure""
                        connection-string = ""{connectionString}""
                    }}
                }}

                 snapshot-store {{
                     plugin = ""akka.persistence.snapshot-store.azure-blob-store""

                     azure-blob-store {{
                        class = ""Akka.Persistence.Azure.Snapshot.AzureBlobSnapshotStore, Akka.Persistence.Azure""
                        connection-string = ""{connectionString}""
                    }}
                }}
            }}";
        }*/

        public static AkkaConfigurationBuilder ConfigurePetabridgeCmd(
            this AkkaConfigurationBuilder builder
        )
        {
            return builder.AddPetabridgeCmd(cmd =>
            {
                cmd.RegisterCommandPalette(ClusterCommands.Instance);
                cmd.RegisterCommandPalette(new RemoteCommands());
                cmd.RegisterCommandPalette(ClusterShardingCommands.Instance);
                cmd.Start();
            });
        }
    }
}
