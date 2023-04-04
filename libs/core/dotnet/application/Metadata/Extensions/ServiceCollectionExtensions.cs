using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Metadata
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddMetadataProvider<TMetadataProvider>(
            this IServiceCollection services
        )
            where TMetadataProvider : class, IMetadataProvider
        {
            services.AddTransient<IMetadataProvider, TMetadataProvider>();
            return services;
        }

        public static IServiceCollection AddMetadataProviders(
            this IServiceCollection services,
            params Type[] metadataProviderTypes
        )
        {
            return services.AddMetadataProviders((IEnumerable<Type>)metadataProviderTypes);
        }

        public static IServiceCollection AddMetadataProviders(
            this IServiceCollection services,
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
            return services.AddMetadataProviders(metadataProviderTypes);
        }

        public static IServiceCollection AddMetadataProviders(
            this IServiceCollection services,
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

                services.AddTransient(typeof(IMetadataProvider), t);
            }
            return services;
        }

        private static bool IsMetadataProvider(this Type type)
        {
            return type.IsAssignableTo<IMetadataProvider>();
        }
    }
}
