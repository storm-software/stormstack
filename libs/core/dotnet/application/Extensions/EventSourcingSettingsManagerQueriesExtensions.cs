using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Queries;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Core.Application.Extensions
{
    public static class ServiceCollectionQueriesExtensions
    {
        public static IServiceCollection AddQueryHandler<TQueryHandler, TQuery, TResult>(
            this IServiceCollection serviceCollection
        )
            where TQueryHandler : class, IQueryHandler<TQuery, TResult>
            where TQuery : class, IQuery<TResult>
            where TResult : ReadModel
        {
            serviceCollection.AddTransient<IQueryHandler<TQuery, TResult>, TQueryHandler>();
            return serviceCollection;
        }

        public static IServiceCollection AddQueryHandlers(
            this IServiceCollection serviceCollection,
            params Type[] queryHandlerTypes
        )
        {
            return serviceCollection.AddQueryHandlers((IEnumerable<Type>)queryHandlerTypes);
        }

        public static IServiceCollection AddQueryHandlers(
            this IServiceCollection serviceCollection,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var subscribeSynchronousToTypes = fromAssembly
                .GetTypes()
                .Where(t => t.GetTypeInfo().GetInterfaces().Any(IsQueryHandlerInterface))
                .Where(t => !t.HasConstructorParameterOfType(IsQueryHandlerInterface))
                .Where(t => predicate(t));
            return serviceCollection.AddQueryHandlers(subscribeSynchronousToTypes);
        }

        public static IServiceCollection AddQueryHandlers(
            this IServiceCollection serviceCollection,
            IEnumerable<Type> queryHandlerTypes
        )
        {
            foreach (var queryHandlerType in queryHandlerTypes)
            {
                var t = queryHandlerType;
                if (t.GetTypeInfo().IsAbstract)
                    continue;
                var queryHandlerInterfaces = t.GetTypeInfo()
                    .GetInterfaces()
                    .Where(IsQueryHandlerInterface)
                    .ToList();
                if (!queryHandlerInterfaces.Any())
                {
                    throw new ArgumentException(
                        $"Type '{t.PrettyPrint()}' is not an '{typeof(IQueryHandler<,>).PrettyPrint()}'"
                    );
                }

                foreach (var queryHandlerInterface in queryHandlerInterfaces)
                {
                    serviceCollection.AddTransient(queryHandlerInterface, t);
                }
            }

            return serviceCollection;
        }

        private static bool IsQueryHandlerInterface(this Type type)
        {
            return type.GetTypeInfo().IsGenericType
                && type.GetGenericTypeDefinition() == typeof(IQueryHandler<,>);
        }
    }
}
