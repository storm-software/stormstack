using System.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace OpenSystem.Akka.Redis.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static ServiceProvider AddRedisReadStore(
            this ServiceProvider serviceProvider,
            IConfiguration configuration
        )
        {
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();

            var readSettings = configuration
                .GetSection("RedisReadStoreSettings")
                .Get<RedisReadStoreSettings>();
            Debug.Assert(
                readSettings.ConnectionStringName != null,
                nameof(readSettings.ConnectionStringName) + " != null"
            );

            if (string.IsNullOrEmpty(readSettings.ConnectionString))
            {
                readSettings.ConnectionString = configuration.GetConnectionString(
                    readSettings.ConnectionStringName
                );
            }

            Debug.Assert(
                readSettings.ConnectionString != null,
                nameof(readSettings.ConnectionString) + " != null"
            );

            serviceProvider.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = readSettings.ConnectionString;
                options.InstanceName = readSettings.InstanceName;
            });

            serviceProvider.AddSingleton<RedisReadStore>();

            var redisService = serviceProvider.GetService<RedisReadStore>();
            redisService.Connect();

            return serviceProvider;
        }
    }
}
