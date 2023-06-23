using System.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using Microsoft.Extensions.Caching.StackExchangeRedis;

namespace OpenSystem.Akka.Redis.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceProvider AddRedisReadStore(this IServiceProvider serviceProvider)
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

            /*serviceProvider.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = readSettings.ConnectionString;
                options.InstanceName = readSettings.InstanceName;
            });

            serviceProvider.AddScoped<RedisReadStore>();*/

            /*var redisService = serviceProvider.GetService<RedisReadStore>();
            redisService.Connect();*/

            return serviceProvider;
        }
    }
}
