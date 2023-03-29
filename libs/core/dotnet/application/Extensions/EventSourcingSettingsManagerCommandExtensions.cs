using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Application.Commands;

namespace OpenSystem.Core.Application.Extensions
{
    public static class EventSourcingSettingsManagerCommandExtensions
    {
        public static EventSourcingSettingsManager AddCommands(
            this EventSourcingSettingsManager eventFlowOptions,
            params Type[] commandTypes
        )
        {
            return eventFlowOptions.AddCommands(commandTypes);
        }

        public static EventSourcingSettingsManager AddCommands(
            this EventSourcingSettingsManager eventFlowOptions,
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
            return eventFlowOptions.AddCommands(commandTypes);
        }
    }
}
