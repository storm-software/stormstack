using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ReadStores;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddEvents(
            this IServiceCollection services,
            IEnumerable<Type> aggregateEventTypes
        )
        {
            var cbAggregateEventTypes = new ConcurrentBag<Type>();
            foreach (var aggregateEventType in aggregateEventTypes)
            {
                if (!typeof(IAggregateEvent).GetTypeInfo().IsAssignableFrom(aggregateEventType))
                    throw new ArgumentException(
                        $"Type {aggregateEventType.PrettyPrint()} is not a {typeof(IAggregateEvent).PrettyPrint()}"
                    );

                cbAggregateEventTypes.Add(aggregateEventType);
            }

            services.TryAddSingleton<ILoadedVersions<IAggregateEvent>>(
                new LoadedVersions<IAggregateEvent>(cbAggregateEventTypes)
            );

            return services;
        }

        public static IServiceCollection UseEventPersistence<TEventPersistence>(
            this IServiceCollection services
        )
            where TEventPersistence : class, IEventPersistence
        {
            services.Add(
                new ServiceDescriptor(
                    typeof(IEventPersistence),
                    typeof(TEventPersistence),
                    ServiceLifetime.Singleton
                )
            );

            return services;
        }

        public static IServiceCollection AddEvents(
            this IServiceCollection serviceCollection,
            Assembly fromAssembly,
            Predicate<Type>? predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var aggregateEventTypes = fromAssembly
                .GetTypes()
                .Where(
                    t =>
                        !t.GetTypeInfo().IsAbstract
                        && typeof(IAggregateEvent).GetTypeInfo().IsAssignableFrom(t)
                )
                .Where(t => predicate(t));

            return serviceCollection.AddEvents(aggregateEventTypes as IEnumerable<Type>);
        }

        public static IServiceCollection AddEvents(
            this IServiceCollection serviceCollection,
            params Type[] aggregateEventTypes
        )
        {
            return serviceCollection.AddEvents(aggregateEventTypes as IEnumerable<Type>);
        }

        public static IServiceCollection AddEventUpgrader<TAggregate, TIdentity, TEventUpgrader>(
            this IServiceCollection serviceCollection
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TEventUpgrader : class, IEventUpgrader<TAggregate, TIdentity>
        {
            serviceCollection.AddTransient<IEventUpgrader<TAggregate, TIdentity>, TEventUpgrader>();
            return serviceCollection;
        }

        public static IServiceCollection AddEventUpgrader<TAggregate, TIdentity>(
            this IServiceCollection serviceCollection,
            Func<IServiceProvider, IEventUpgrader<TAggregate, TIdentity>> factory
        )
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            serviceCollection.AddTransient(factory);
            return serviceCollection;
        }

        public static IServiceCollection AddEventUpgraders(
            this IServiceCollection serviceCollection,
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
            return serviceCollection.AddEventUpgraders(eventUpgraderTypes);
        }

        public static IServiceCollection AddEventUpgraders(
            this IServiceCollection serviceCollection,
            params Type[] eventUpgraderTypes
        )
        {
            return serviceCollection.AddEventUpgraders((IEnumerable<Type>)eventUpgraderTypes);
        }

        public static IServiceCollection AddEventUpgraders(
            this IServiceCollection serviceCollection,
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

                serviceCollection.AddTransient(eventUpgraderForAggregateType, t);
            }

            return serviceCollection;
        }

        private static bool IsEventUpgraderInterface(Type type)
        {
            return type.GetTypeInfo().IsGenericType
                && type.GetGenericTypeDefinition() == typeof(IEventUpgrader<,>);
        }

        public static IServiceCollection AddDomainDefaults(
            this IServiceCollection serviceCollection
        )
        {
            serviceCollection.AddMemoryCache();

            // Default no-op resilience strategies
            serviceCollection.AddTransient(
                typeof(IOptimisticConcurrencyRetryStrategy),
                typeof(OptimisticConcurrencyRetryStrategy)
            );
            serviceCollection.AddTransient(
                typeof(IAggregateStoreResilienceStrategy),
                typeof(NoAggregateStoreResilienceStrategy)
            );
            serviceCollection.AddTransient(
                typeof(IDispatchToReadStoresResilienceStrategy),
                typeof(NoDispatchToReadStoresResilienceStrategy)
            );
            serviceCollection.AddTransient(
                typeof(IDispatchToReadStores),
                typeof(DispatchToReadStores)
            );
            serviceCollection.AddTransient(typeof(IEventStore), typeof(BaseEventStore));
            serviceCollection.AddSingleton(
                typeof(IEventUpgradeContextFactory),
                typeof(EventUpgradeContextFactory)
            );
            serviceCollection.AddSingleton(
                typeof(IEventPersistence),
                typeof(InMemoryEventPersistence)
            );
            serviceCollection.AddTransient(typeof(IAggregateStore), typeof(AggregateStore));
            serviceCollection.AddTransient(typeof(IReadModelPopulator), typeof(ReadModelPopulator));
            serviceCollection.AddTransient(
                typeof(IEventJsonSerializer),
                typeof(EventJsonSerializer)
            );
            serviceCollection.AddSingleton(typeof(IJsonSerializer), typeof(BaseJsonSerializer));
            serviceCollection.AddTransient(typeof(IJsonOptions), typeof(JsonOptions));
            serviceCollection.AddTransient(typeof(IJobScheduler), typeof(InstantJobScheduler));
            serviceCollection.AddTransient(typeof(IJobRunner), typeof(JobRunner));
            serviceCollection.AddSingleton(
                typeof(IEventUpgradeManager),
                typeof(EventUpgradeManager)
            );
            serviceCollection.AddTransient(typeof(IAggregateFactory), typeof(AggregateFactory));
            serviceCollection.AddTransient(
                typeof(IReadModelDomainEventApplier),
                typeof(ReadModelDomainEventApplier)
            );
            serviceCollection.AddSingleton(typeof(IDomainEventFactory), typeof(DomainEventFactory));
            serviceCollection.TryAddTransient(
                typeof(ITransientFaultHandler<>),
                typeof(TransientFaultHandler<>)
            );
            serviceCollection.AddSingleton(typeof(IReadModelFactory<>), typeof(ReadModelFactory<>));

            // Definition services
            serviceCollection.AddSingleton(
                typeof(IEventDefinitionService),
                typeof(EventDefinitionService)
            );

            return serviceCollection;
        }
    }
}
