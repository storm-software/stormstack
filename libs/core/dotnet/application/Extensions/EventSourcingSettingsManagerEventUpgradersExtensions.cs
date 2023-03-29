using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using Microsoft.Extensions.DependencyInjection;

namespace OpenSystem.Core.Application.Extensions
{
    public static class EventSourcingSettingsManagerEventUpgradersExtensions
    {
        public static EventSourcingSettingsManager AddEventUpgrader<
            TAggregate,
            TIdentity,
            TEventUpgrader
        >(this EventSourcingSettingsManager eventFlowOptions)
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TEventUpgrader : class, IEventUpgrader<TAggregate, TIdentity>
        {
            eventFlowOptions.ServiceCollection.AddTransient<
                IEventUpgrader<TAggregate, TIdentity>,
                TEventUpgrader
            >();
            return eventFlowOptions;
        }

        public static EventSourcingSettingsManager AddEventUpgrader<TAggregate, TIdentity>(
            this EventSourcingSettingsManager eventFlowOptions,
            Func<IServiceProvider, IEventUpgrader<TAggregate, TIdentity>> factory
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            eventFlowOptions.ServiceCollection.AddTransient(factory);
            return eventFlowOptions;
        }

        public static EventSourcingSettingsManager AddEventUpgraders(
            this EventSourcingSettingsManager eventFlowOptions,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var eventUpgraderTypes = fromAssembly
                .GetTypes()
                .Where(t => t.GetTypeInfo().GetInterfaces().Any(IsEventUpgraderInterface))
                .Where(t => !t.HasConstructorParameterOfType(IsEventUpgraderInterface))
                .Where(t => predicate(t));
            return eventFlowOptions.AddEventUpgraders(eventUpgraderTypes);
        }

        public static EventSourcingSettingsManager AddEventUpgraders(
            this EventSourcingSettingsManager eventFlowOptions,
            params Type[] eventUpgraderTypes
        )
        {
            return eventFlowOptions.AddEventUpgraders((IEnumerable<Type>)eventUpgraderTypes);
        }

        public static EventSourcingSettingsManager AddEventUpgraders(
            this EventSourcingSettingsManager eventFlowOptions,
            IEnumerable<Type> eventUpgraderTypes
        )
        {
            foreach (var eventUpgraderType in eventUpgraderTypes)
            {
                var t = eventUpgraderType;
                if (t.GetTypeInfo().IsAbstract)
                    continue;
                var eventUpgraderForAggregateType = t.GetTypeInfo()
                    .GetInterfaces()
                    .SingleOrDefault(IsEventUpgraderInterface);
                if (eventUpgraderForAggregateType == null)
                {
                    throw new ArgumentException(
                        $"Type '{eventUpgraderType.Name}' does not have the '{typeof(IEventUpgrader<,>).PrettyPrint()}' interface"
                    );
                }

                eventFlowOptions.ServiceCollection.AddTransient(eventUpgraderForAggregateType, t);
            }

            return eventFlowOptions;
        }

        private static bool IsEventUpgraderInterface(Type type)
        {
            return type.GetTypeInfo().IsGenericType
                && type.GetGenericTypeDefinition() == typeof(IEventUpgrader<,>);
        }
    }
}
