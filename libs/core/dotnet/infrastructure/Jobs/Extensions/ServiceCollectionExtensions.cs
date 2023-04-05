using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Reflection;
using System.Collections.Concurrent;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Application.Jobs;
using OpenSystem.Core.Infrastructure.Publishers;

namespace OpenSystem.Core.Infrastructure.Jobs.Extensions
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddJobs(
            this IServiceCollection services,
            IEnumerable<Type> jobTypes
        )
        {
            var cbJobTypes = new ConcurrentBag<Type>
            {
                typeof(PublishCommandJob),
                typeof(DispatchToAsynchronousEventSubscribersJob)
            };
            foreach (var jobType in jobTypes)
            {
                if (!typeof(IJob).GetTypeInfo().IsAssignableFrom(jobType))
                    throw new ArgumentException(
                        $"Type {jobType.PrettyPrint()} is not a {typeof(IJob).PrettyPrint()}"
                    );

                cbJobTypes.Add(jobType);
            }

            services.TryAddSingleton<ILoadedVersions<IJob>>(new LoadedVersions<IJob>(cbJobTypes));

            return services;
        }

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
