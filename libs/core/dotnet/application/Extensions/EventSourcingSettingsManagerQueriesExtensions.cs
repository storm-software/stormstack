using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Application.Queries;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.ReadStores;

namespace OpenSystem.Core.Application.Extensions
{
    public static class EventSourcingSettingsManagerQueriesExtensions
    {
        public static EventSourcingSettingsManager AddQueryHandler<TQueryHandler, TQuery, TResult>(
            this EventSourcingSettingsManager eventFlowOptions
        )
            where TQueryHandler : class, IQueryHandler<TQuery, TResult>
            where TQuery : class, IQuery<TResult>
            where TResult : ReadModel
        {
            eventFlowOptions.ServiceCollection.AddTransient<
                IQueryHandler<TQuery, TResult>,
                TQueryHandler
            >();
            return eventFlowOptions;
        }

        public static EventSourcingSettingsManager AddQueryHandlers(
            this EventSourcingSettingsManager eventFlowOptions,
            params Type[] queryHandlerTypes
        )
        {
            return eventFlowOptions.AddQueryHandlers((IEnumerable<Type>)queryHandlerTypes);
        }

        public static EventSourcingSettingsManager AddQueryHandlers(
            this EventSourcingSettingsManager eventFlowOptions,
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
            return eventFlowOptions.AddQueryHandlers(subscribeSynchronousToTypes);
        }

        public static EventSourcingSettingsManager AddQueryHandlers(
            this EventSourcingSettingsManager eventFlowOptions,
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
                    eventFlowOptions.ServiceCollection.AddTransient(queryHandlerInterface, t);
                }
            }

            return eventFlowOptions;
        }

        private static bool IsQueryHandlerInterface(this Type type)
        {
            return type.GetTypeInfo().IsGenericType
                && type.GetGenericTypeDefinition() == typeof(IQueryHandler<,>);
        }
    }
}
