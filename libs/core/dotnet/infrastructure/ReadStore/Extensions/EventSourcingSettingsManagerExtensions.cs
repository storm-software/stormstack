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
    public static class EventSourcingSettingsManagerExtensions
    {
        public static EventSourcingSettingsManager UseInMemoryReadStoreFor<TReadModel>(
            this EventSourcingSettingsManager eventFlowOptions
        )
            where TReadModel : class, IReadModel
        {
            RegisterInMemoryReadStore<TReadModel>(eventFlowOptions.ServiceCollection);
            eventFlowOptions.UseReadStoreFor<IInMemoryReadStore<TReadModel>, TReadModel>();
            return eventFlowOptions;
        }

        public static EventSourcingSettingsManager UseInMemoryReadStoreFor<
            TReadModel,
            TReadModelLocator
        >(this EventSourcingSettingsManager eventFlowOptions)
            where TReadModel : class, IReadModel
            where TReadModelLocator : IReadModelLocator
        {
            RegisterInMemoryReadStore<TReadModel>(eventFlowOptions.ServiceCollection);
            eventFlowOptions.UseReadStoreFor<
                IInMemoryReadStore<TReadModel>,
                TReadModel,
                TReadModelLocator
            >();
            return eventFlowOptions;
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
