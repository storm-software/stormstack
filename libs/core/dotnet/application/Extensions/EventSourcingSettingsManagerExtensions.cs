using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain;

namespace OpenSystem.Core.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddEventSourcing(
            this IServiceCollection serviceCollection,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            return serviceCollection
                //.AddEvents(fromAssembly, predicate)
                .AddApplicationDefaults()
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
