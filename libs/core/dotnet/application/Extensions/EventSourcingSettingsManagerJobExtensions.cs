using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Application.Jobs;
using Microsoft.Extensions.DependencyInjection;

namespace OpenSystem.Core.Application.Extensions
{
    public static class EventSourcingSettingsManagerJobExtensions
    {
        public static IServiceCollection AddJobs(
            this IServiceCollection serviceCollection,
            params Type[] jobTypes
        )
        {
            return serviceCollection.AddJobs(jobTypes as IEnumerable<Type>);
        }

        public static IServiceCollection AddJobs(
            this IServiceCollection serviceCollection,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var jobTypes = fromAssembly
                .GetTypes()
                .Where(type => !type.GetTypeInfo().IsAbstract && type.IsAssignableTo<IJob>())
                .Where(t => !t.HasConstructorParameterOfType(i => i.IsAssignableTo<IJob>()))
                .Where(t => predicate(t));
            return serviceCollection.AddJobs(jobTypes);
        }
    }
}
