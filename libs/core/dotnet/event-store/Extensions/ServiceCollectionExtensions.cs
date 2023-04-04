using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection.Extensions;
using OpenSystem.Core.EventStore.Settings;

namespace OpenSystem.Core.EventStore.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection UseEventStoreEventPersistence(
            this IServiceCollection services,
            IConfiguration configuration,
            string connectionNamePrefix = "OpenSystem"
        )
        {
            var sanitizedConnectionNamePrefix = string.IsNullOrEmpty(connectionNamePrefix)
                ? string.Empty
                : connectionNamePrefix + " - ";

            services.AddEventStoreConfiguration(configuration);
            services.AddEventStoreClient(configuration.GetConnectionString("EventStoreConnection"));
            services.UseEventPersistence<EventStoreEventPersistence>();

            return services;
        }

        public static IServiceCollection AddEventStoreConfiguration(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            var settings = configuration.GetSection("EventStoreSettings");
            var eventStoreSettings = new EventStoreSettings
            {
                QueryMaxCount = settings.GetValue<int>("QueryMaxCount"),
            };

            var queryDeadline = settings.GetValue<int>("QueryDeadline");
            if (queryDeadline != null)
                eventStoreSettings.QueryDeadline = TimeSpan.FromMilliseconds(queryDeadline);

            services.TryAddSingleton<IEventStoreSettings>(eventStoreSettings);

            return services;
        }
    }
}
