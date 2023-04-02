using System.Reflection;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Application.Extensions;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ReadStores;
using OpenSystem.Core.Infrastructure.ReadStores.InMemory;

namespace OpenSystem.Core.Infrastructure.ReadStores.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection UseInMemoryReadStoreFor<TReadModel>(
            this IServiceCollection services
        )
            where TReadModel : class, IReadModel
        {
            RegisterInMemoryReadStore<TReadModel>(services);
            services.UseReadStoreFor<IInMemoryReadStore<TReadModel>, TReadModel>();
            return services;
        }

        public static IServiceCollection UseInMemoryReadStoreFor<TReadModel, TReadModelLocator>(
            this IServiceCollection services
        )
            where TReadModel : class, IReadModel
            where TReadModelLocator : IReadModelLocator
        {
            RegisterInMemoryReadStore<TReadModel>(services);
            services.UseReadStoreFor<
                IInMemoryReadStore<TReadModel>,
                TReadModel,
                TReadModelLocator
            >();
            return services;
        }

        private static void RegisterInMemoryReadStore<TReadModel>(
            IServiceCollection serviceCollection
        )
            where TReadModel : class, IReadModel
        {
            serviceCollection.AddSingleton<
                IInMemoryReadStore<TReadModel>,
                InMemoryReadStore<TReadModel>
            >();
            serviceCollection.AddTransient<IReadModelStore<TReadModel>>(
                r => r.GetRequiredService<IInMemoryReadStore<TReadModel>>()
            );
            serviceCollection.AddTransient<
                IQueryHandler<InMemoryQuery<TReadModel>, IReadOnlyCollection<TReadModel>>,
                InMemoryQueryHandler<TReadModel>
            >();
        }
    }
}
