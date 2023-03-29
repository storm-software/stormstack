using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Application.Sagas;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Extensions
{
    public static class EventSourcingSettingsManagerMetadataProvidersExtensions
    {
        public static EventSourcingSettingsManager AddMetadataProvider<TMetadataProvider>(
            this EventSourcingSettingsManager eventFlowOptions
        )
            where TMetadataProvider : class, IMetadataProvider
        {
            eventFlowOptions.ServiceCollection.AddTransient<IMetadataProvider, TMetadataProvider>();
            return eventFlowOptions;
        }

        public static EventSourcingSettingsManager AddMetadataProviders(
            this EventSourcingSettingsManager eventFlowOptions,
            params Type[] metadataProviderTypes
        )
        {
            return eventFlowOptions.AddMetadataProviders((IEnumerable<Type>)metadataProviderTypes);
        }

        public static EventSourcingSettingsManager AddMetadataProviders(
            this EventSourcingSettingsManager eventFlowOptions,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var metadataProviderTypes = fromAssembly
                .GetTypes()
                .Where(IsMetadataProvider)
                .Where(t => !t.HasConstructorParameterOfType(IsMetadataProvider))
                .Where(t => predicate(t));
            return eventFlowOptions.AddMetadataProviders(metadataProviderTypes);
        }

        public static EventSourcingSettingsManager AddMetadataProviders(
            this EventSourcingSettingsManager eventFlowOptions,
            IEnumerable<Type> metadataProviderTypes
        )
        {
            foreach (var t in metadataProviderTypes)
            {
                if (t.GetTypeInfo().IsAbstract)
                    continue;
                if (!t.IsMetadataProvider())
                {
                    throw new ArgumentException(
                        $"Type '{t.PrettyPrint()}' is not an '{typeof(IMetadataProvider).PrettyPrint()}'"
                    );
                }

                eventFlowOptions.ServiceCollection.AddTransient(typeof(IMetadataProvider), t);
            }
            return eventFlowOptions;
        }

        private static bool IsMetadataProvider(this Type type)
        {
            return type.IsAssignableTo<IMetadataProvider>();
        }
    }
}
