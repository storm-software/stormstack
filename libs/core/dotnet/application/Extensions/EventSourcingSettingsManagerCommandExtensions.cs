using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Application.Commands;
using Microsoft.Extensions.DependencyInjection;

namespace OpenSystem.Core.Application.Extensions
{
    public static class ServiceCollectionCommandExtensions
    {
        public static IServiceCollection AddCommands(
            this IServiceCollection serviceCollection,
            params Type[] commandTypes
        )
        {
            return serviceCollection.AddCommands(commandTypes);
        }

        public static IServiceCollection AddCommands(
            this IServiceCollection serviceCollection,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var commandTypes = fromAssembly
                .GetTypes()
                .Where(
                    t =>
                        !t.GetTypeInfo().IsAbstract
                        && typeof(ICommand).GetTypeInfo().IsAssignableFrom(t)
                )
                .Where(t => predicate(t));

            return serviceCollection.AddCommands(commandTypes);
        }
    }
}
