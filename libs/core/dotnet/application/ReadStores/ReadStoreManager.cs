using System.Reflection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Application.ReadStores
{
    public abstract class ReadStoreManager<TReadModelStore, TReadModel>
        : IReadStoreManager<TReadModel>
        where TReadModelStore : IReadModelStore<TReadModel>
        where TReadModel : class, IReadModel
    {
        private static readonly Type StaticReadModelType = typeof(TReadModel);

        private static readonly ISet<Type> AggregateEventTypes;

        protected ILogger<ReadStoreManager<TReadModelStore, TReadModel>> Logger { get; }

        protected IServiceProvider ServiceProvider { get; }

        protected TReadModelStore ReadModelStore { get; }

        protected IReadModelDomainEventApplier ReadModelDomainEventApplier { get; }

        protected IReadModelFactory<TReadModel> ReadModelFactory { get; }

        public Type ReadModelType => StaticReadModelType;

        static ReadStoreManager()
        {
            var readModelForInterfaceTypes = StaticReadModelType
                .GetTypeInfo()
                .GetInterfaces()
                .Where(IsReadModelFor)
                .ToList();
            if (!readModelForInterfaceTypes.Any())
            {
                throw new ArgumentException(
                    $"Read model type '{StaticReadModelType.PrettyPrint()}' does not implement any '{typeof(IReadModelFor<,,>).PrettyPrint()}'"
                );
            }

            AggregateEventTypes = new HashSet<Type>(
                readModelForInterfaceTypes.Select(i => i.GetTypeInfo().GetGenericArguments()[2])
            );
            if (AggregateEventTypes.Count != readModelForInterfaceTypes.Count)
            {
                throw new ArgumentException(
                    $"Read model type '{StaticReadModelType.PrettyPrint()}' implements ambiguous '{typeof(IReadModelFor<,,>).PrettyPrint()}' interfaces"
                );
            }
        }

        private static bool IsReadModelFor(Type i)
        {
            if (!i.GetTypeInfo().IsGenericType)
            {
                return false;
            }

            var typeDefinition = i.GetGenericTypeDefinition();
            return typeDefinition == typeof(IReadModelFor<,,>);
        }

        protected ReadStoreManager(
            ILogger<ReadStoreManager<TReadModelStore, TReadModel>> logger,
            IServiceProvider serviceProvider,
            TReadModelStore readModelStore,
            IReadModelDomainEventApplier readModelDomainEventApplier,
            IReadModelFactory<TReadModel> readModelFactory
        )
        {
            Logger = logger;
            ServiceProvider = serviceProvider;
            ReadModelStore = readModelStore;
            ReadModelDomainEventApplier = readModelDomainEventApplier;
            ReadModelFactory = readModelFactory;
        }

        public async Task UpdateReadStoresAsync(
            IReadOnlyCollection<IDomainEvent> domainEvents,
            CancellationToken cancellationToken
        )
        {
            var relevantDomainEvents = domainEvents
                .Where(e => AggregateEventTypes.Contains(e.EventType))
                .ToList();

            if (!relevantDomainEvents.Any())
            {
                if (Logger.IsEnabled(LogLevel.Trace))
                {
                    Logger.LogTrace(
                        "None of these events was relevant for read model {ReadModelType}, skipping update: {DomainEventTypes}",
                        StaticReadModelType.PrettyPrint(),
                        domainEvents.Select(e => e.EventType.PrettyPrint()).ToList()
                    );
                }
                return;
            }

            if (Logger.IsEnabled(LogLevel.Trace))
            {
                Logger.LogTrace(
                    "Updating read model {ReadModelType} in store {ReadModelStoreType} with these events: {DomainEventTypes}",
                    StaticReadModelType.PrettyPrint(),
                    typeof(TReadModelStore).PrettyPrint(),
                    relevantDomainEvents.Select(e => e.ToString())
                );
            }

            var contextFactory = new ReadModelContextFactory(ServiceProvider);

            var readModelUpdates = BuildReadModelUpdates(relevantDomainEvents);

            if (!readModelUpdates.Any())
            {
                if (Logger.IsEnabled(LogLevel.Trace))
                {
                    Logger.LogTrace(
                        "No read model updates after building for read model {ReadModelType} in store {ReadModelStoreType} with these events: {DomainEventTypes}",
                        StaticReadModelType.PrettyPrint(),
                        typeof(TReadModelStore).PrettyPrint(),
                        relevantDomainEvents.Select(e => e.ToString()).ToList()
                    );
                }
                return;
            }

            await ReadModelStore
                .UpdateAsync(readModelUpdates, contextFactory, UpdateAsync, cancellationToken)
                .ConfigureAwait(false);
        }

        protected abstract IReadOnlyCollection<ReadModelUpdate> BuildReadModelUpdates(
            IReadOnlyCollection<IDomainEvent> domainEvents
        );

        protected abstract Task<ReadModelEnvelope<TReadModel>> UpdateAsync(
            IReadModelContext readModelContext,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            ReadModelEnvelope<TReadModel> readModelEnvelope,
            CancellationToken cancellationToken
        );
    }
}
