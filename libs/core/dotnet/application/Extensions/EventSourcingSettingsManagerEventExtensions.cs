using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Extensions
{
    public static class EventSourcingSettingsManagerEventExtensions
    {
        public static EventSourcingSettingsManager AddEvents(
            this EventSourcingSettingsManager eventFlowOptions,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var aggregateEventTypes = fromAssembly
                .GetTypes()
                .Where(
                    t =>
                        !t.GetTypeInfo().IsAbstract
                        && typeof(IAggregateEvent).GetTypeInfo().IsAssignableFrom(t)
                )
                .Where(t => predicate(t));
            return eventFlowOptions.AddEvents(aggregateEventTypes);
        }

        public static EventSourcingSettingsManager AddEvents(
            this EventSourcingSettingsManager eventFlowOptions,
            params Type[] aggregateEventTypes
        )
        {
            return eventFlowOptions.AddEvents((IEnumerable<Type>)aggregateEventTypes);
        }
    }
}
