using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Application.Utilities;

namespace OpenSystem.Core.Application.Extensions
{
    public static class ServiceCollectionCommandHandlerExtensions
    {
        public static IServiceCollection AddCommandHandlers(
            this IServiceCollection serviceCollection,
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

            return serviceCollection.AddCommandHandlers(commandHandlerTypes);
        }

        public static IServiceCollection AddCommandHandlers(
            this IServiceCollection serviceCollection,
            params Type[] commandHandlerTypes
        )
        {
            return serviceCollection.AddCommandHandlers((IEnumerable<Type>)commandHandlerTypes);
        }

        public static IServiceCollection AddCommandHandlers(
            this IServiceCollection serviceCollection,
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
                    serviceCollection.AddTransient(handlesCommandType, t);
                }
            }

            return serviceCollection;
        }

        private static bool IsCommandHandlerInterface(this Type type)
        {
            return type.GetTypeInfo().IsGenericType
                && type.GetGenericTypeDefinition() == typeof(ICommandHandler<,,>);
        }
    }
}
