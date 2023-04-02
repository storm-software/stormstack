using System;
using System.Net;
using EventStore.Client;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain;
using OpenSystem.Core.Infrastructure.EventStore.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection.Extensions;
using OpenSystem.Core.Infrastructure.EventStore.Settings;

namespace OpenSystem.Core.Infrastructure.EventStore.Extensions
{
    public static class EventSourcingSettingsExtensions
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
