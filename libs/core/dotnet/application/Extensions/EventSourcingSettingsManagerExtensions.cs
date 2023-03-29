using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Application.Utilities;

namespace OpenSystem.Core.Application.Extensions
{
    public static class EventSourcingSettingsManagerExtensions
    {
        public static EventSourcingSettingsManager AddEventSourcing(
            this EventSourcingSettingsManager eventSourcingSettingsManager,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            return eventSourcingSettingsManager
                .AddEvents(fromAssembly, predicate)
                .AddJobs(fromAssembly, predicate)
                .AddCommands(fromAssembly, predicate)
                .AddCommandHandlers(fromAssembly, predicate)
                .AddMetadataProviders(fromAssembly, predicate)
                .AddSubscribers(fromAssembly, predicate)
                .AddEventUpgraders(fromAssembly, predicate)
                .AddQueryHandlers(fromAssembly, predicate)
                //.AddSnapshots(fromAssembly, predicate)
                //.AddSnapshotUpgraders(fromAssembly, predicate)
                .AddSagas(fromAssembly, predicate)
                .AddSagaLocators(fromAssembly, predicate);
        }
    }
}
