using System.Diagnostics;
using Akka.Persistence.Redis;
using Akka.Persistence.Hosting;
using Akka.Configuration;
using Akka.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using OpenSystem.Akka.Configuration;

namespace OpenSystem.Akka.Redis
{
    public class RedisSnapshotSettings : RedisSettings
    {
        public RedisSnapshotSettings(
            string connectionStringName,
            string configurationString,
            string keyPrefix,
            int database,
            bool useDatabaseFromConnectionString
        )
            : base(configurationString, keyPrefix, database, useDatabaseFromConnectionString)
        {
            ConnectionStringName = connectionStringName;
        }

        public string ConnectionStringName { get; set; } = "RedisSnapshot";

        public new static RedisSnapshotSettings Create(Config config)
        {
            if (config == null)
                throw new ArgumentNullException(nameof(config));

            return new RedisSnapshotSettings(
                config.GetString("connection-string-name", string.Empty),
                config.GetString("configuration-string", string.Empty),
                config.GetString("key-prefix", string.Empty),
                config.GetInt("database", 0),
                config.GetBoolean("use-database-number-from-connection-string")
            );
        }
    }
}
