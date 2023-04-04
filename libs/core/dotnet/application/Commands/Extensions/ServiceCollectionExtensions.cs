using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using System.Collections.Concurrent;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Common;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace OpenSystem.Core.Application.Commands.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCommands(
            this IServiceCollection services,
            params Type[] commandTypes
        )
        {
            return services.AddCommands(commandTypes);
        }

        public static IServiceCollection AddCommands(
            this IServiceCollection services,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var commandTypes = fromAssembly
                .GetTypes()
                .Where(
                    t =>
                        !t.GetTypeInfo().IsAbstract
                        && typeof(ICommand).GetTypeInfo().IsAssignableFrom(t)
                )
                .Where(t => predicate(t));

            return services.AddCommands(commandTypes);
        }

        public static IServiceCollection AddCommands(
            this IServiceCollection services,
            IEnumerable<Type> commandTypes
        )
        {
            var cbAggregateEventTypes = new ConcurrentBag<Type>();
            foreach (var commandType in commandTypes)
            {
                if (!typeof(ICommand).GetTypeInfo().IsAssignableFrom(commandType))
                    throw new ArgumentException(
                        $"Type {commandType.PrettyPrint()} is not a {typeof(ICommand).PrettyPrint()}"
                    );

                cbAggregateEventTypes.Add(commandType);
            }

            services.TryAddSingleton<ILoadedVersions<ICommand>>(
                new LoadedVersions<ICommand>(cbAggregateEventTypes)
            );

            return services;
        }

        public static IServiceCollection AddCommandHandlers(
            this IServiceCollection services,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var commandHandlerTypes = fromAssembly
                .GetTypes()
                .Where(t => t.GetTypeInfo().GetInterfaces().Any(IsCommandHandlerInterface))
                .Where(t => !t.HasConstructorParameterOfType(IsCommandHandlerInterface))
                .Where(t => predicate(t));

            return services.AddCommandHandlers(commandHandlerTypes);
        }

        public static IServiceCollection AddCommandHandlers(
            this IServiceCollection services,
            params Type[] commandHandlerTypes
        )
        {
            return services.AddCommandHandlers((IEnumerable<Type>)commandHandlerTypes);
        }

        public static IServiceCollection AddCommandHandlers(
            this IServiceCollection services,
            IEnumerable<Type> commandHandlerTypes
        )
        {
            foreach (var commandHandlerType in commandHandlerTypes)
            {
                var t = commandHandlerType;
                if (t.GetTypeInfo().IsAbstract)
                    continue;
                var handlesCommandTypes = t.GetTypeInfo()
                    .GetInterfaces()
                    .Where(IsCommandHandlerInterface)
                    .ToList();
                if (!handlesCommandTypes.Any())
                {
                    throw new ArgumentException(
                        $"Type '{commandHandlerType.PrettyPrint()}' does not implement '{typeof(ICommandHandler<,,>).PrettyPrint()}'"
                    );
                }

                foreach (var handlesCommandType in handlesCommandTypes)
                {
                    services.AddTransient(handlesCommandType, t);
                }
            }

            return services;
        }

        private static bool IsCommandHandlerInterface(this Type type)
        {
            return type.GetTypeInfo().IsGenericType
                && type.GetGenericTypeDefinition() == typeof(ICommandHandler<,,>);
        }
    }
}
