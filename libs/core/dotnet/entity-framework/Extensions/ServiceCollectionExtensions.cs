using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Application.Extensions;
using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Core.EntityFramework.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddPersistenceInfrastructure(
            this IServiceCollection services,
            ApplicationSettings settings
        )
        {
            services.AddSingleton<SoftDeletedAuditableEntitySaveChangesInterceptor>();
            services.AddSingleton<ValidateSaveChangesInterceptor>();
        }
    }
}
