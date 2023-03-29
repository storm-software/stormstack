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
    public static class EventSourcingSettingsManagerCommandHandlerExtensions
    {
        public static EventSourcingSettingsManager AddCommandHandlers(
            this EventSourcingSettingsManager eventSourcingSettingsManager,
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
            return eventSourcingSettingsManager.AddCommandHandlers(commandHandlerTypes);
        }

        public static EventSourcingSettingsManager AddCommandHandlers(
            this EventSourcingSettingsManager eventSourcingSettingsManager,
            params Type[] commandHandlerTypes
        )
        {
            return eventSourcingSettingsManager.AddCommandHandlers(
                (IEnumerable<Type>)commandHandlerTypes
            );
        }

        public static EventSourcingSettingsManager AddCommandHandlers(
            this EventSourcingSettingsManager eventSourcingSettingsManager,
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
                    eventSourcingSettingsManager.ServiceCollection.AddTransient(
                        handlesCommandType,
                        t
                    );
                }
            }

            return eventSourcingSettingsManager;
        }

        private static bool IsCommandHandlerInterface(this Type type)
        {
            return type.GetTypeInfo().IsGenericType
                && type.GetGenericTypeDefinition() == typeof(ICommandHandler<,,>);
        }
    }
}
