using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Jobs;

namespace OpenSystem.Core.Application.Extensions
{
    public static class EventSourcingSettingsManagerJobExtensions
    {
        public static EventSourcingSettingsManager AddJobs(
            this EventSourcingSettingsManager eventFlowOptions,
            params Type[] jobTypes
        )
        {
            return eventFlowOptions.AddJobs(jobTypes);
        }

        public static EventSourcingSettingsManager AddJobs(
            this EventSourcingSettingsManager eventFlowOptions,
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
            return eventFlowOptions.AddJobs(jobTypes);
        }
    }
}
