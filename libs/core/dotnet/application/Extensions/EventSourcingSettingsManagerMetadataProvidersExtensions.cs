using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Application.Sagas;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Extensions
{
    public static class ServiceCollectionMetadataProvidersExtensions
    {
        public static IServiceCollection AddMetadataProvider<TMetadataProvider>(
            this IServiceCollection serviceCollection
        )
            where TMetadataProvider : class, IMetadataProvider
        {
            serviceCollection.AddTransient<IMetadataProvider, TMetadataProvider>();
            return serviceCollection;
        }

        public static IServiceCollection AddMetadataProviders(
            this IServiceCollection serviceCollection,
            params Type[] metadataProviderTypes
        )
        {
            return serviceCollection.AddMetadataProviders((IEnumerable<Type>)metadataProviderTypes);
        }

        public static IServiceCollection AddMetadataProviders(
            this IServiceCollection serviceCollection,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var metadataProviderTypes = fromAssembly
                .GetTypes()
                .Where(IsMetadataProvider)
                .Where(t => !t.HasConstructorParameterOfType(IsMetadataProvider))
                .Where(t => predicate(t));
            return serviceCollection.AddMetadataProviders(metadataProviderTypes);
        }

        public static IServiceCollection AddMetadataProviders(
            this IServiceCollection serviceCollection,
            IEnumerable<Type> metadataProviderTypes
        )
        {
            foreach (var t in metadataProviderTypes)
            {
                if (t.GetTypeInfo().IsAbstract)
                    continue;
                if (!t.IsMetadataProvider())
                {
                    throw new ArgumentException(
                        $"Type '{t.PrettyPrint()}' is not an '{typeof(IMetadataProvider).PrettyPrint()}'"
                    );
                }

                serviceCollection.AddTransient(typeof(IMetadataProvider), t);
            }
            return serviceCollection;
        }

        private static bool IsMetadataProvider(this Type type)
        {
            return type.IsAssignableTo<IMetadataProvider>();
        }
    }
}
