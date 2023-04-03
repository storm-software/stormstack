using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Infrastructure.EventPersistence.InMemory.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection UseInMemoryEventPersistence(
            this IServiceCollection services
        )
        {
            services.AddSingleton(typeof(IEventPersistence), typeof(InMemoryEventPersistence));

            return services;
        }
    }
}
