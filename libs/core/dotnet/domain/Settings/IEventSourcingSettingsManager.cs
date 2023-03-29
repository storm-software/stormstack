using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.Settings
{
    public interface IEventSourcingSettingsManager
    {
        IServiceCollection ServiceCollection { get; }

        IEventSourcingSettingsManager ConfigureThrowSubscriberExceptions(bool shouldThrow);

        IEventSourcingSettingsManager ConfigureOptimisticConcurrencyRetry(
            int retries,
            TimeSpan delayBeforeRetry
        );
        IEventSourcingSettingsManager Configure(Action<EventSourcingSettings> configure);

        IEventSourcingSettingsManager AddEvents(IEnumerable<Type> aggregateEventTypes);

        IEventSourcingSettingsManager AddCommands(IEnumerable<Type> commandTypes);

        IEventSourcingSettingsManager AddJobs(IEnumerable<Type> jobTypes);

        IEventSourcingSettingsManager AddSagas(IEnumerable<Type> sagaTypes);

        IEventSourcingSettingsManager AddSnapshots(IEnumerable<Type> snapshotTypes);

        IEventSourcingSettingsManager UseEventPersistence(
            Func<IServiceProvider, IEventPersistence> eventPersistenceResolver,
            ServiceLifetime serviceLifetime = ServiceLifetime.Transient
        );

        IEventSourcingSettingsManager UseEventPersistence<TEventPersistence>(
            ServiceLifetime serviceLifetime = ServiceLifetime.Transient
        )
            where TEventPersistence : class, IEventPersistence;

        IEventSourcingSettingsManager RegisterServices(Action<IServiceCollection> registerServices);
    }
}
