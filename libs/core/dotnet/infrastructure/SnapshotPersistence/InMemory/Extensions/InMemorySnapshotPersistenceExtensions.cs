using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain;

namespace OpenSystem.Core.Infrastructure.SnapshotPersistence.InMemory.Extensions
{
    public static class InMemorySnapshotPersistenceExtensions
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
