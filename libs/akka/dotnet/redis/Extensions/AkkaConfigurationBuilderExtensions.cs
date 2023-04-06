using System.Diagnostics;
using Akka.Persistence.Redis;
using Akka.Persistence.Hosting;
using Akka.Configuration;
using Akka.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using OpenSystem.Akka.Configuration;

namespace OpenSystem.Akka.Redis.Extensions
{
    public static class AkkaConfigurationBuilderExtensions
    {
        public static AkkaConfigurationBuilder ConfigureRedisSnapshotPersistence(
            this AkkaConfigurationBuilder builder,
            IServiceProvider serviceProvider
        )
        {
            return builder.AddHocon(
                GetRedisSnapshotPersistenceHocon(serviceProvider),
                HoconAddMode.Append
            );
        }

        public static Config GetRedisSnapshotPersistenceHocon(IServiceProvider serviceProvider)
        {
            var settings = serviceProvider.GetRequiredService<AkkaSettings>();
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();

            var connectionSnapshotStringName = configuration
                .GetSection("RedisSnapshotSettings")
                .Get<RedisSnapshotSettings>()
                ?.ConnectionStringName;
            Debug.Assert(
                connectionSnapshotStringName != null,
                nameof(connectionSnapshotStringName) + " != null"
            );

            var connectionSnapshotString = configuration.GetConnectionString(
                connectionSnapshotStringName
            );
            Debug.Assert(
                connectionSnapshotString != null,
                nameof(connectionSnapshotString) + " != null"
            );

            return GetRedisSnapshotPersistenceHocon(connectionSnapshotString);
        }

        public static Config GetRedisSnapshotPersistenceHocon(string connectionString)
        {
            return $@"
                snapshot-store {{
                        plugin = ""akka.persistence.snapshot-store.redis""

                        akka.persistence.snapshot-store.redis {{

                        # qualified type name of the Redis persistence journal actor
                        class = ""Akka.Persistence.Redis.Snapshot.RedisSnapshotStore, Akka.Persistence.Redis""

                        # connection string, as described here: https://stackexchange.github.io/StackExchange.Redis/Configuration#basic-configuration-strings
                        configuration-string = ""{connectionString}""

                        # Redis journals key prefixes. Leave it for default or change it to appropriate value. WARNING: don't change it on production instances.
                        key-prefix = ""
                    }}
                }}
            ";
        }
    }
}
