using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Events.Snapshots;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Domain.Utilities;
using System.Text.Json;
using OpenSystem.Core.Domain.ReadStores;
using OpenSystem.Core.Application.Commands;
using OpenSystem.Core.Application.Sagas;
using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.Queries;
using OpenSystem.Core.Application.Subscribers;
using OpenSystem.Core.Domain.Settings;

namespace OpenSystem.Core.Application.Utilities
{
    public class EventSourcingSettingsManager
    {
        private readonly ConcurrentBag<Type> _aggregateEventTypes = new ConcurrentBag<Type>();

        private readonly ConcurrentBag<Type> _sagaTypes = new ConcurrentBag<Type>();

        private readonly ConcurrentBag<Type> _commandTypes = new ConcurrentBag<Type>();

        private readonly EventSourcingSettings _configuration = new EventSourcingSettings();

        private readonly ConcurrentBag<Type> _jobTypes = new ConcurrentBag<Type>
        {
            typeof(PublishCommandJob),
            typeof(DispatchToAsynchronousEventSubscribersJob)
        };

        private readonly List<Type> _snapshotTypes = new List<Type>();

        public IServiceCollection ServiceCollection { get; }

        private EventSourcingSettingsManager(IServiceCollection serviceCollection)
        {
            ServiceCollection = serviceCollection;

            RegisterDefaults(ServiceCollection);
        }

        public static EventSourcingSettingsManager New() =>
            new EventSourcingSettingsManager(
                new ServiceCollection().AddLogging(
                    b => b.SetMinimumLevel(LogLevel.Trace).AddConsole()
                )
            );

        public static EventSourcingSettingsManager New(IServiceCollection serviceCollection) =>
            new EventSourcingSettingsManager(serviceCollection);

        public EventSourcingSettingsManager ConfigureOptimisticConcurrencyRetry(
            int retries,
            TimeSpan delayBeforeRetry
        )
        {
            _configuration.NumberOfRetriesOnOptimisticConcurrencyExceptions = retries;
            _configuration.DelayBeforeRetryOnOptimisticConcurrencyExceptions = delayBeforeRetry;

            return this;
        }

        public EventSourcingSettingsManager ConfigureThrowSubscriberExceptions(bool shouldThrow)
        {
            _configuration.ThrowSubscriberExceptions = shouldThrow;

            return this;
        }

        public EventSourcingSettingsManager Configure(Action<EventSourcingSettings> configure)
        {
            configure(_configuration);
            return this;
        }

        public EventSourcingSettingsManager AddEvents(IEnumerable<Type> aggregateEventTypes)
        {
            foreach (var aggregateEventType in aggregateEventTypes)
            {
                if (!typeof(IAggregateEvent).GetTypeInfo().IsAssignableFrom(aggregateEventType))
                {
                    throw new ArgumentException(
                        $"Type {aggregateEventType.PrettyPrint()} is not a {typeof(IAggregateEvent).PrettyPrint()}"
                    );
                }
                _aggregateEventTypes.Add(aggregateEventType);
            }
            return this;
        }

        public EventSourcingSettingsManager AddSagas(IEnumerable<Type> sagaTypes)
        {
            foreach (var sagaType in sagaTypes)
            {
                if (!typeof(ISaga).GetTypeInfo().IsAssignableFrom(sagaType))
                {
                    throw new ArgumentException(
                        $"Type {sagaType.PrettyPrint()} is not a {typeof(ISaga).PrettyPrint()}"
                    );
                }
                _sagaTypes.Add(sagaType);
            }
            return this;
        }

        public EventSourcingSettingsManager AddCommands(IEnumerable<Type> commandTypes)
        {
            foreach (var commandType in commandTypes)
            {
                if (!typeof(ICommand).GetTypeInfo().IsAssignableFrom(commandType))
                {
                    throw new ArgumentException(
                        $"Type {commandType.PrettyPrint()} is not a {typeof(ICommand).PrettyPrint()}"
                    );
                }
                _commandTypes.Add(commandType);
            }
            return this;
        }

        public EventSourcingSettingsManager AddJobs(IEnumerable<Type> jobTypes)
        {
            foreach (var jobType in jobTypes)
            {
                if (!typeof(IJob).GetTypeInfo().IsAssignableFrom(jobType))
                {
                    throw new ArgumentException(
                        $"Type {jobType.PrettyPrint()} is not a {typeof(IJob).PrettyPrint()}"
                    );
                }
                _jobTypes.Add(jobType);
            }
            return this;
        }

        public EventSourcingSettingsManager AddSnapshots(IEnumerable<Type> snapshotTypes)
        {
            foreach (var snapshotType in snapshotTypes)
            {
                if (!typeof(ISnapshot).GetTypeInfo().IsAssignableFrom(snapshotType))
                {
                    throw new ArgumentException(
                        $"Type {snapshotType.PrettyPrint()} is not a {typeof(ISnapshot).PrettyPrint()}"
                    );
                }
                _snapshotTypes.Add(snapshotType);
            }
            return this;
        }

        public EventSourcingSettingsManager UseEventPersistence(
            Func<IServiceProvider, IEventPersistence> eventPersistenceResolver,
            ServiceLifetime serviceLifetime = ServiceLifetime.Transient
        )
        {
            ServiceCollection.Add(
                new ServiceDescriptor(
                    typeof(IEventStore),
                    eventPersistenceResolver,
                    serviceLifetime
                )
            );
            return this;
        }

        public EventSourcingSettingsManager UseEventPersistence<TEventPersistence>(
            ServiceLifetime serviceLifetime = ServiceLifetime.Transient
        )
            where TEventPersistence : class, IEventPersistence
        {
            ServiceCollection.Add(
                new ServiceDescriptor(
                    typeof(IEventPersistence),
                    typeof(TEventPersistence),
                    serviceLifetime
                )
            );
            return this;
        }

        public EventSourcingSettingsManager RegisterServices(
            Action<IServiceCollection> registerServices
        )
        {
            registerServices(this.ServiceCollection);
            return this;
        }

        private void RegisterDefaults(IServiceCollection serviceCollection)
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
                typeof(ISagaUpdateResilienceStrategy),
                typeof(NoSagaUpdateResilienceStrategy)
            );
            serviceCollection.AddTransient(
                typeof(IDispatchToSubscriberResilienceStrategy),
                typeof(NoDispatchToSubscriberResilienceStrategy)
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
            serviceCollection.AddTransient(typeof(ICommandBus), typeof(CommandBus));
            serviceCollection.AddTransient(typeof(IAggregateStore), typeof(AggregateStore));
            /*serviceCollection.AddTransient(typeof(ISnapshotStore, SnapshotStore>();
            serviceCollection.AddTransient(typeof(ISnapshotSerializer, SnapshotSerializer>();
            serviceCollection.AddTransient(typeof(ISnapshotPersistence, NullSnapshotPersistence>();
            serviceCollection.AddTransient(typeof(ISnapshotUpgradeService, SnapshotUpgradeService>();*/
            serviceCollection.AddTransient(typeof(IReadModelPopulator), typeof(ReadModelPopulator));
            serviceCollection.AddTransient(
                typeof(IEventJsonSerializer),
                typeof(EventJsonSerializer)
            );
            serviceCollection.AddTransient(typeof(IQueryProcessor), typeof(QueryProcessor));
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
            serviceCollection.AddTransient(
                typeof(IDomainEventPublisher),
                typeof(DomainEventPublisher)
            );
            serviceCollection.AddTransient(
                typeof(ISerializedCommandPublisher),
                typeof(SerializedCommandPublisher)
            );
            serviceCollection.AddTransient(
                typeof(IDispatchToEventSubscribers),
                typeof(DispatchToEventSubscribers)
            );
            serviceCollection.AddSingleton(typeof(IDomainEventFactory), typeof(DomainEventFactory));
            serviceCollection.AddTransient(typeof(ISagaStore), typeof(SagaAggregateStore));
            serviceCollection.AddTransient(typeof(ISagaErrorHandler), typeof(SagaErrorHandler));
            serviceCollection.AddTransient(typeof(IDispatchToSagas), typeof(DispatchToSagas));
            serviceCollection.AddTransient(typeof(ISagaUpdater<,,,>), typeof(SagaUpdater<,,,>));
            serviceCollection.AddTransient<EventSourcingSettings>(_ => _configuration);
            serviceCollection.AddTransient<ICancellationSettings>(_ => _configuration);
            serviceCollection.TryAddTransient(
                typeof(ITransientFaultHandler<>),
                typeof(TransientFaultHandler<>)
            );
            serviceCollection.AddSingleton(typeof(IReadModelFactory<>), typeof(ReadModelFactory<>));
            serviceCollection.AddSingleton<Func<Type, ISagaErrorHandler>>(_ => __ => null);

            // Definition services
            serviceCollection.AddSingleton(
                typeof(IEventDefinitionService),
                typeof(EventDefinitionService)
            );
            /*serviceCollection.AddSingleton(typeof(
                ISnapshotDefinitionService,
                SnapshotDefinitionService
            ));*/
            serviceCollection.AddSingleton(
                typeof(IJobDefinitionService),
                typeof(JobDefinitionService)
            );
            serviceCollection.AddSingleton(
                typeof(ISagaDefinitionService),
                typeof(SagaDefinitionService)
            );
            serviceCollection.AddSingleton(
                typeof(ICommandDefinitionService),
                typeof(CommandDefinitionService)
            );

            serviceCollection.AddSingleton<ILoadedVersions>(
                r =>
                    new LoadedVersions(
                        _jobTypes,
                        _commandTypes,
                        _aggregateEventTypes,
                        _sagaTypes,
                        _snapshotTypes
                    )
            );
        }
    }
}
