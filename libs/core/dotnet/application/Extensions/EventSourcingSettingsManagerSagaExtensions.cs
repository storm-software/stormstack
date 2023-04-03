using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Sagas;
using Microsoft.Extensions.DependencyInjection;

namespace OpenSystem.Core.Application.Extensions
{
    public static class IServiceCollectionSagaExtensions
    {
        public static IServiceCollection AddSagas(
            this IServiceCollection serviceCollection,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var sagaTypes = fromAssembly
                .GetTypes()
                .Where(t => !t.GetTypeInfo().IsAbstract && t.IsAssignableTo<ISaga>())
                .Where(t => predicate(t));

            return serviceCollection.AddSagas(sagaTypes);
        }

        public static IServiceCollection AddSagas(
            this IServiceCollection serviceCollection,
            params Type[] sagaTypes
        )
        {
            return serviceCollection.AddSagas(sagaTypes);
        }

        public static IServiceCollection AddSagaLocators(
            this IServiceCollection serviceCollection,
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

            return serviceCollection.AddSagaLocators(sagaTypes);
        }

        public static IServiceCollection AddSagaLocators(
            this IServiceCollection serviceCollection,
            params Type[] sagaLocatorTypes
        )
        {
            return serviceCollection.AddSagaLocators((IEnumerable<Type>)sagaLocatorTypes);
        }

        public static IServiceCollection AddSagaLocators(
            this IServiceCollection serviceCollection,
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
                serviceCollection.AddTransient(sagaLocatorType);
            }

            return serviceCollection;
        }
    }
}
