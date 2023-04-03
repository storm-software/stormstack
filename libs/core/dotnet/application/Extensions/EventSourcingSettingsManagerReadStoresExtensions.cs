using System.Reflection;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.ReadStores;
using OpenSystem.Core.Domain.Aggregates;

namespace OpenSystem.Core.Application.Extensions
{
    public static class ServiceCollectionReadStoresExtensions
    {
        private static readonly MethodInfo UseSingleAggregateRestoreMethod =
            typeof(ServiceCollectionReadStoresExtensions)
                .GetTypeInfo()
                .GetMethods()
                .Single(
                    m => m.Name == nameof(UseReadStoreFor) && m.GetGenericArguments().Length == 4
                );

        public static IServiceCollection UseReadStoreFor<TReadStore, TReadModel>(
            this IServiceCollection serviceCollection
        )
            where TReadStore : class, IReadModelStore<TReadModel>
            where TReadModel : class, IReadModel
        {
            (Type aggregateType, Type idType) = GetSingleAggregateTypes<TReadModel>();

            return (IServiceCollection)
                UseSingleAggregateRestoreMethod
                    .MakeGenericMethod(
                        aggregateType,
                        idType,
                        typeof(TReadStore),
                        typeof(TReadModel)
                    )
                    .Invoke(null, new object[] { serviceCollection });
        }

        [Obsolete("Use the simpler method UseReadStoreFor<TReadStore, TReadModel> instead.")]
        public static IServiceCollection UseReadStoreFor<
            TAggregate,
            TIdentity,
            TReadStore,
            TReadModel
        >(this IServiceCollection serviceCollection)
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TReadStore : class, IReadModelStore<TReadModel>
            where TReadModel : class, IReadModel
        {
            serviceCollection
                .AddTransient<
                    IReadStoreManager,
                    SingleAggregateReadStoreManager<TAggregate, TIdentity, TReadStore, TReadModel>
                >()
                .AddTransient<
                    IQueryHandler<GetByIdQuery<TReadModel>, TReadModel>,
                    GetByIdQueryHandler<TReadStore, TReadModel>
                >();
            return serviceCollection;
        }

        public static IServiceCollection UseReadStoreFor<TReadStore, TReadModel, TReadModelLocator>(
            this IServiceCollection serviceCollection
        )
            where TReadStore : class, IReadModelStore<TReadModel>
            where TReadModel : class, IReadModel
            where TReadModelLocator : IReadModelLocator
        {
            serviceCollection
                .AddTransient<
                    IReadStoreManager,
                    MultipleAggregateReadStoreManager<TReadStore, TReadModel, TReadModelLocator>
                >()
                .AddTransient<
                    IQueryHandler<GetByIdQuery<TReadModel>, TReadModel>,
                    GetByIdQueryHandler<TReadStore, TReadModel>
                >();
            return serviceCollection;
        }

        private static (Type aggregateType, Type idType) GetSingleAggregateTypes<TReadModel>()
            where TReadModel : class, IReadModel
        {
            var readModelInterface = typeof(IReadModelFor<,,>);
            var asyncReadModelInterface = typeof(IReadModelFor<,,>);

            bool IsReadModelInterface(Type type)
            {
                TypeInfo info = type.GetTypeInfo();
                if (!info.IsGenericType)
                    return false;
                Type definition = info.GetGenericTypeDefinition();
                return definition == readModelInterface || definition == asyncReadModelInterface;
            }

            var readModelType = typeof(TReadModel);
            var results = readModelType
                .GetTypeInfo()
                .GetInterfaces()
                .Where(IsReadModelInterface)
                .GroupBy(
                    i =>
                        new
                        {
                            AggregateType = i.GenericTypeArguments[0],
                            IdType = i.GenericTypeArguments[1]
                        }
                )
                .ToList();

            if (!results.Any())
            {
                var message =
                    $"You are trying to register ReadModel type {typeof(TReadModel).PrettyPrint()} "
                    + "which doesn't subscribe to any events. Implement "
                    + "the IAmReadModelFor<,,> or IAmAsyncReadModelFor<,,> interfaces.";

                throw new InvalidOperationException(message);
            }

            if (results.Count > 1)
            {
                var message =
                    $"You are trying to register ReadModel type {typeof(TReadModel).PrettyPrint()} "
                    + "which subscribes to events from different aggregates. "
                    + "Use a ReadModelLocator, like this: "
                    + $"options.UseSomeReadStoreFor<{typeof(TReadModel)},MyReadModelLocator>";

                throw new InvalidOperationException(message);
            }

            var result = results.Single();
            return (result.Key.AggregateType, result.Key.IdType);
        }
    }
}
