using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using System.Collections.Concurrent;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace OpenSystem.Core.Application.Sagas.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddSagas(
            this IServiceCollection services,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var sagaTypes = fromAssembly
                .GetTypes()
                .Where(t => !t.GetTypeInfo().IsAbstract && t.IsAssignableTo<ISaga>())
                .Where(t => predicate(t));

            return services.AddSagas(sagaTypes);
        }

        public static IServiceCollection AddSagas(
            this IServiceCollection services,
            params Type[] sagaTypes
        )
        {
            return services.AddSagas(sagaTypes);
        }

        public static IServiceCollection AddSagas(
            this IServiceCollection services,
            IEnumerable<Type> sagaTypes
        )
        {
            var cbSagaTypes = new ConcurrentBag<Type>();
            foreach (var sagaType in sagaTypes)
            {
                if (!typeof(ISaga).GetTypeInfo().IsAssignableFrom(sagaType))
                {
                    throw new ArgumentException(
                        $"Type {sagaType.PrettyPrint()} is not a {typeof(ISaga).PrettyPrint()}"
                    );
                }

                cbSagaTypes.Add(sagaType);
            }

            services.TryAddSingleton<ILoadedVersions<ISaga>>(
                new LoadedVersions<ISaga>(cbSagaTypes)
            );

            return services;
        }

        public static IServiceCollection AddSagaLocators(
            this IServiceCollection services,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var sagaTypes = fromAssembly
                .GetTypes()
                .Where(t => !t.GetTypeInfo().IsAbstract && t.IsAssignableTo<ISagaLocator>())
                .Where(t => !t.HasConstructorParameterOfType(x => x.IsAssignableTo<ISagaLocator>()))
                .Where(t => predicate(t));

            return services.AddSagaLocators(sagaTypes);
        }

        public static IServiceCollection AddSagaLocators(
            this IServiceCollection services,
            params Type[] sagaLocatorTypes
        )
        {
            return services.AddSagaLocators((IEnumerable<Type>)sagaLocatorTypes);
        }

        public static IServiceCollection AddSagaLocators(
            this IServiceCollection services,
            IEnumerable<Type> sagaLocatorTypes
        )
        {
            foreach (var sagaLocatorType in sagaLocatorTypes)
            {
                if (!typeof(ISagaLocator).GetTypeInfo().IsAssignableFrom(sagaLocatorType))
                {
                    throw new ArgumentException(
                        $"Type '{sagaLocatorType.PrettyPrint()}' is not a '{typeof(ISagaLocator).PrettyPrint()}'"
                    );
                }
                services.AddTransient(sagaLocatorType);
            }

            return services;
        }
    }
}
