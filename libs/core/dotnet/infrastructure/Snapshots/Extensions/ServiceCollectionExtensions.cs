using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain;

namespace OpenSystem.Core.Infrastructure.Snapshots.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection UseInMemorySnapshotPersistence(
            this IServiceCollection services
        )
        {
            return services.UseSnapshotPersistence<InMemorySnapshotPersistence>(
                ServiceLifetime.Singleton
            );
        }
    }
}
