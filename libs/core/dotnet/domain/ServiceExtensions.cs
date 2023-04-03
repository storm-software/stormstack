using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Snapshots;

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

        public static IServiceCollection AddSnapshots(
            this IServiceCollection services,
            IEnumerable<Type> snapshotTypes
        )
        {
            var cbSnapshots = new ConcurrentBag<Type>();
            foreach (var snapshotType in snapshotTypes)
            {
                if (!typeof(ISnapshot).GetTypeInfo().IsAssignableFrom(snapshotType))
                    throw new ArgumentException(
                        $"Type {snapshotType.PrettyPrint()} is not a {typeof(ISnapshot).PrettyPrint()}"
                    );

                cbSnapshots.Add(snapshotType);
            }

            services.TryAddSingleton<ILoadedVersions<ISnapshot>>(
                new LoadedVersions<ISnapshot>(cbSnapshots)
            );

            return services;
        }

        public static IServiceCollection AddSnapshots(
            this IServiceCollection services,
            params Type[] snapshotTypes
        )
        {
            return services.AddSnapshots(snapshotTypes);
        }

        public static IServiceCollection AddSnapshots(
            this IServiceCollection services,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var snapshotTypes = fromAssembly
                .GetTypes()
                .Where(
                    t =>
                        !t.GetTypeInfo().IsAbstract
                        && typeof(ISnapshot).GetTypeInfo().IsAssignableFrom(t)
                )
                .Where(t => predicate(t));
            return services.AddSnapshots(snapshotTypes);
        }

        public static IServiceCollection AddSnapshotUpgraders(
            this IServiceCollection services,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);

            var snapshotUpgraderTypes = fromAssembly
                .GetTypes()
                .Where(t => !t.GetTypeInfo().IsAbstract)
                .Where(t => t.GetTypeInfo().GetInterfaces().Any(IsSnapshotUpgraderInterface))
                .Where(t => !t.HasConstructorParameterOfType(IsSnapshotUpgraderInterface))
                .Where(t => predicate(t));

            return services.AddSnapshotUpgraders(snapshotUpgraderTypes);
        }

        public static IServiceCollection AddSnapshotUpgraders(
            this IServiceCollection services,
            params Type[] snapshotUpgraderTypes
        )
        {
            return services.AddSnapshotUpgraders((IEnumerable<Type>)snapshotUpgraderTypes);
        }

        public static IServiceCollection AddSnapshotUpgraders(
            this IServiceCollection services,
            IEnumerable<Type> snapshotUpgraderTypes
        )
        {
            foreach (var snapshotUpgraderType in snapshotUpgraderTypes)
            {
                var interfaceType = snapshotUpgraderType
                    .GetTypeInfo()
                    .GetInterfaces()
                    .Single(IsSnapshotUpgraderInterface);
                services.AddTransient(interfaceType, snapshotUpgraderType);
            }

            return services;
        }

        public static IServiceCollection UseSnapshotPersistence<T>(
            this IServiceCollection services,
            ServiceLifetime serviceLifetime
        )
            where T : class, ISnapshotPersistence
        {
            services.Replace(
                ServiceDescriptor.Describe(typeof(ISnapshotPersistence), typeof(T), serviceLifetime)
            );

            return services;
        }

        private static bool IsSnapshotUpgraderInterface(Type type)
        {
            return type.GetTypeInfo().IsGenericType
                && type.GetGenericTypeDefinition() == typeof(ISnapshotUpgrader<,>);
        }

        public static IServiceCollection AddDomainDefaults(
            this IServiceCollection serviceCollection
        )
        {
            serviceCollection.AddMemoryCache();

            serviceCollection.AddSnapshots(Assembly.GetExecutingAssembly());
            serviceCollection.AddSnapshotUpgraders(Assembly.GetExecutingAssembly());

            // Default no-op resilience strategies
            serviceCollection.AddTransient(
                typeof(IOptimisticConcurrencyRetryStrategy),
                typeof(OptimisticConcurrencyRetryStrategy)
            );
            serviceCollection.AddTransient(
                typeof(IAggregateStoreResilienceStrategy),
                typeof(NoAggregateStoreResilienceStrategy)
            );
            serviceCollection.AddTransient(typeof(IEventStore), typeof(BaseEventStore));
            serviceCollection.AddSingleton(
                typeof(IEventUpgradeContextFactory),
                typeof(EventUpgradeContextFactory)
            );
            serviceCollection.AddTransient(typeof(IAggregateStore), typeof(AggregateStore));
            serviceCollection.AddTransient(typeof(ISnapshotStore), typeof(SnapshotStore));
            serviceCollection.AddTransient(typeof(ISnapshotSerializer), typeof(SnapshotSerializer));

            serviceCollection.AddTransient(
                typeof(ISnapshotUpgradeService),
                typeof(SnapshotUpgradeService)
            );
            serviceCollection.AddTransient(
                typeof(IEventJsonSerializer),
                typeof(EventJsonSerializer)
            );
            serviceCollection.AddSingleton(typeof(IJsonSerializer), typeof(BaseJsonSerializer));
            serviceCollection.AddTransient(typeof(IJsonOptions), typeof(JsonOptions));
            serviceCollection.AddSingleton(
                typeof(IEventUpgradeManager),
                typeof(EventUpgradeManager)
            );
            serviceCollection.AddTransient(typeof(IAggregateFactory), typeof(AggregateFactory));

            serviceCollection.AddSingleton(typeof(IDomainEventFactory), typeof(DomainEventFactory));
            serviceCollection.TryAddTransient(
                typeof(ITransientFaultHandler<>),
                typeof(TransientFaultHandler<>)
            );
            // Definition services
            serviceCollection.AddSingleton(
                typeof(ISnapshotDefinitionService),
                typeof(SnapshotDefinitionService)
            );
            serviceCollection.AddSingleton(
                typeof(IEventDefinitionService),
                typeof(EventDefinitionService)
            );

            return serviceCollection;
        }
    }
}
