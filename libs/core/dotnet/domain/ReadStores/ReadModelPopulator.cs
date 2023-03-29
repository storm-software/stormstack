using System.Diagnostics;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Settings;

namespace OpenSystem.Core.Domain.ReadStores
{
    public class ReadModelPopulator : IReadModelPopulator
    {
        private readonly ILogger<ReadModelPopulator> _logger;

        private readonly EventSourcingSettings _configuration;

        private readonly IEventStore _eventStore;

        private readonly IServiceProvider _serviceProvider;

        private readonly IEventUpgradeContextFactory _eventUpgradeContextFactory;

        public ReadModelPopulator(
            ILogger<ReadModelPopulator> logger,
            EventSourcingSettings configuration,
            IEventStore eventStore,
            IServiceProvider serviceProvider,
            IEventUpgradeContextFactory eventUpgradeContextFactory
        )
        {
            _logger = logger;
            _configuration = configuration;
            _eventStore = eventStore;
            _serviceProvider = serviceProvider;
            _eventUpgradeContextFactory = eventUpgradeContextFactory;
        }

        public Task PurgeAsync<TReadModel>(CancellationToken cancellationToken)
            where TReadModel : class, IReadModel
        {
            return PurgeAsync(typeof(TReadModel), cancellationToken);
        }

        public async Task PurgeAsync(Type readModelType, CancellationToken cancellationToken)
        {
            var readModelStores = ResolveReadModelStores(readModelType);

            var deleteTasks = readModelStores.Select(s => s.DeleteAllAsync(cancellationToken));
            await Task.WhenAll(deleteTasks).ConfigureAwait(false);
        }

        public async Task DeleteAsync(
            string id,
            Type readModelType,
            CancellationToken cancellationToken
        )
        {
            var readModelStores = ResolveReadModelStores(readModelType);

            _logger.LogTrace(
                "Deleting read model {ReadModelType} with ID {Id}",
                readModelType.PrettyPrint(),
                id
            );

            var deleteTasks = readModelStores.Select(s => s.DeleteAsync(id, cancellationToken));
            await Task.WhenAll(deleteTasks).ConfigureAwait(false);
        }

        public Task PopulateAsync<TReadModel>(CancellationToken cancellationToken)
            where TReadModel : class, IReadModel
        {
            return PopulateAsync(typeof(TReadModel), cancellationToken);
        }

        public async Task PopulateAsync(Type readModelType, CancellationToken cancellationToken)
        {
            var stopwatch = Stopwatch.StartNew();
            var readStoreManagers = ResolveReadStoreManagers(readModelType);
            var eventUpgradeContext = await _eventUpgradeContextFactory.CreateAsync(
                cancellationToken
            );

            var readModelTypes = new[] { typeof(IReadModelFor<,,>), typeof(IReadModelFor<,,>) };

            var aggregateEventTypes = new HashSet<Type>(
                readModelType
                    .GetTypeInfo()
                    .GetInterfaces()
                    .Where(
                        i =>
                            i.GetTypeInfo().IsGenericType
                            && readModelTypes.Contains(i.GetGenericTypeDefinition())
                    )
                    .Select(i => i.GetTypeInfo().GetGenericArguments()[2])
            );

            if (_logger.IsEnabled(LogLevel.Trace))
            {
                _logger.LogTrace(
                    "Read model {ReadModelType} is interested in these aggregate events: {AggregateEventTypes}",
                    readModelType.PrettyPrint(),
                    aggregateEventTypes.Select(e => e.PrettyPrint())
                );
            }

            long totalEvents = 0;
            long relevantEvents = 0;
            var currentPosition = GlobalPosition.Start;

            while (true)
            {
                if (_logger.IsEnabled(LogLevel.Trace))
                {
                    _logger.LogTrace(
                        "Loading events starting from {CurrentPosition} and the next {PageSize} for populating {ReadModelType}",
                        currentPosition,
                        _configuration.PopulateReadModelEventPageSize,
                        readModelType.PrettyPrint()
                    );
                }
                var allEventsPage = await _eventStore
                    .LoadAllEventsAsync(
                        currentPosition,
                        _configuration.PopulateReadModelEventPageSize,
                        eventUpgradeContext,
                        cancellationToken
                    )
                    .ConfigureAwait(false);
                totalEvents += allEventsPage.DomainEvents.Count;
                currentPosition = allEventsPage.NextGlobalPosition;

                if (!allEventsPage.DomainEvents.Any())
                {
                    _logger.LogTrace(
                        "No more events in event store, stopping population of read model {ReadModelType}",
                        readModelType.PrettyPrint()
                    );
                    break;
                }

                var domainEvents = allEventsPage.DomainEvents
                    .Where(e => aggregateEventTypes.Contains(e.EventType))
                    .ToList();
                relevantEvents += domainEvents.Count;

                if (!domainEvents.Any())
                {
                    continue;
                }

                var applyTasks = readStoreManagers.Select(
                    m => m.UpdateReadStoresAsync(domainEvents, cancellationToken)
                );
                await Task.WhenAll(applyTasks).ConfigureAwait(false);
            }

            _logger.LogInformation(
                "Population of read model {ReadModelType} took {Seconds} seconds, in which {TotalEventCount} events was loaded and {RelevantEventCount} was relevant",
                readModelType.PrettyPrint(),
                stopwatch.Elapsed.TotalSeconds,
                totalEvents,
                relevantEvents
            );
        }

        private IReadOnlyCollection<IReadModelStore> ResolveReadModelStores(Type readModelType)
        {
            var readModelStoreType = typeof(IReadModelStore<>).MakeGenericType(readModelType);
            var readModelStores = _serviceProvider
                .GetServices(readModelStoreType)
                .Select(s => (IReadModelStore)s)
                .ToList();

            if (!readModelStores.Any())
            {
                throw new ArgumentException(
                    $"Could not find any read stores for read model '{readModelType.PrettyPrint()}'"
                );
            }

            return readModelStores;
        }

        private IReadOnlyCollection<IReadStoreManager> ResolveReadStoreManagers(Type readModelType)
        {
            var readStoreManagers = _serviceProvider
                .GetServices<IReadStoreManager>()
                .Where(m => m.ReadModelType == readModelType)
                .ToList();

            if (!readStoreManagers.Any())
            {
                throw new ArgumentException(
                    $"Did not find any read store managers for read model type '{readModelType.PrettyPrint()}'"
                );
            }

            return readStoreManagers;
        }
    }
}
