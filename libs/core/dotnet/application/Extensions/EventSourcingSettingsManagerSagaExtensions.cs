using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Application.Sagas;
using Microsoft.Extensions.DependencyInjection;

namespace OpenSystem.Core.Application.Extensions
{
    public static class EventSourcingSettingsManagerSagaExtensions
    {
        public static EventSourcingSettingsManager AddSagas(
            this EventSourcingSettingsManager eventFlowOptions,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var sagaTypes = fromAssembly
                .GetTypes()
                .Where(t => !t.GetTypeInfo().IsAbstract && t.IsAssignableTo<ISaga>())
                .Where(t => predicate(t));

            return eventFlowOptions.AddSagas(sagaTypes);
        }

        public static EventSourcingSettingsManager AddSagas(
            this EventSourcingSettingsManager eventFlowOptions,
            params Type[] sagaTypes
        )
        {
            return eventFlowOptions.AddSagas(sagaTypes);
        }

        public static EventSourcingSettingsManager AddSagaLocators(
            this EventSourcingSettingsManager eventFlowOptions,
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

            return eventFlowOptions.AddSagaLocators(sagaTypes);
        }

        public static EventSourcingSettingsManager AddSagaLocators(
            this EventSourcingSettingsManager eventFlowOptions,
            params Type[] sagaLocatorTypes
        )
        {
            return eventFlowOptions.AddSagaLocators((IEnumerable<Type>)sagaLocatorTypes);
        }

        public static EventSourcingSettingsManager AddSagaLocators(
            this EventSourcingSettingsManager eventFlowOptions,
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
                eventFlowOptions.ServiceCollection.AddTransient(sagaLocatorType);
            }

            return eventFlowOptions;
        }
    }
}
