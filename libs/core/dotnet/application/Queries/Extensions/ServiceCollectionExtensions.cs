using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Core.Application.Queries.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddQueryHandler<TQueryHandler, TQuery, TResult>(
            this IServiceCollection services
        )
            where TQueryHandler : class, IQueryHandler<TQuery, TResult>
            where TQuery : class, IQuery<TResult>
            where TResult : ReadModel
        {
            services.AddTransient<IQueryHandler<TQuery, TResult>, TQueryHandler>();
            return services;
        }

        public static IServiceCollection AddQueryHandlers(
            this IServiceCollection services,
            params Type[] queryHandlerTypes
        )
        {
            return services.AddQueryHandlers((IEnumerable<Type>)queryHandlerTypes);
        }

        public static IServiceCollection AddQueryHandlers(
            this IServiceCollection services,
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
            return services.AddQueryHandlers(subscribeSynchronousToTypes);
        }

        public static IServiceCollection AddQueryHandlers(
            this IServiceCollection services,
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
                    services.AddTransient(queryHandlerInterface, t);
                }
            }

            return services;
        }

        private static bool IsQueryHandlerInterface(this Type type)
        {
            return type.GetTypeInfo().IsGenericType
                && type.GetGenericTypeDefinition() == typeof(IQueryHandler<,>);
        }
    }
}
