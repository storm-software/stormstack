using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Application.Utilities;
using OpenSystem.Core.Domain.Jobs;
using OpenSystem.Core.Application.Subscribers;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using Microsoft.Extensions.DependencyInjection;

namespace OpenSystem.Core.Application.Extensions
{
    public static class EventSourcingSettingsManagerSubscriberExtensions
    {
        private static readonly Type SubscribeSynchronousToType = typeof(ISubscribeSynchronousTo<
            ,,
        >);
        private static readonly Type SubscribeAsynchronousToType = typeof(ISubscribeAsynchronousTo<
            ,,
        >);
        private static readonly Type SubscribeSynchronousToAllType =
            typeof(ISubscribeSynchronousToAll);

        public static EventSourcingSettingsManager AddSynchronousSubscriber<
            TAggregate,
            TIdentity,
            TEvent,
            TSubscriber
        >(this EventSourcingSettingsManager eventFlowOptions)
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TEvent : IAggregateEvent<TAggregate, TIdentity>
            where TSubscriber : class, ISubscribeSynchronousTo<TAggregate, TIdentity, TEvent>
        {
            eventFlowOptions.ServiceCollection.AddTransient<
                ISubscribeSynchronousTo<TAggregate, TIdentity, TEvent>,
                TSubscriber
            >();
            return eventFlowOptions;
        }

        public static EventSourcingSettingsManager AddAsynchronousSubscriber<
            TAggregate,
            TIdentity,
            TEvent,
            TSubscriber
        >(this EventSourcingSettingsManager eventFlowOptions)
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TEvent : IAggregateEvent<TAggregate, TIdentity>
            where TSubscriber : class, ISubscribeAsynchronousTo<TAggregate, TIdentity, TEvent>
        {
            eventFlowOptions.ServiceCollection.AddTransient<
                ISubscribeAsynchronousTo<TAggregate, TIdentity, TEvent>,
                TSubscriber
            >();
            return eventFlowOptions;
        }

        public static EventSourcingSettingsManager AddSubscribers(
            this EventSourcingSettingsManager eventFlowOptions,
            params Type[] types
        )
        {
            return eventFlowOptions.AddSubscribers((IEnumerable<Type>)types);
        }

        public static EventSourcingSettingsManager AddSubscribers(
            this EventSourcingSettingsManager eventFlowOptions,
            Assembly fromAssembly,
            Predicate<Type> predicate = null
        )
        {
            predicate = predicate ?? (t => true);
            var types = fromAssembly
                .GetTypes()
                .Where(t => t.GetTypeInfo().GetInterfaces().Any(IsSubscriberInterface))
                .Where(t => !t.HasConstructorParameterOfType(IsSubscriberInterface))
                .Where(t => predicate(t));
            return eventFlowOptions.AddSubscribers(types);
        }

        public static EventSourcingSettingsManager AddSubscribers(
            this EventSourcingSettingsManager eventFlowOptions,
            IEnumerable<Type> subscribeSynchronousToTypes
        )
        {
            foreach (var subscribeSynchronousToType in subscribeSynchronousToTypes)
            {
                var t = subscribeSynchronousToType;
                if (t.GetTypeInfo().IsAbstract)
                {
                    continue;
                }

                var subscribeTos = t.GetTypeInfo()
                    .GetInterfaces()
                    .Where(IsSubscriberInterface)
                    .ToList();
                if (!subscribeTos.Any())
                {
                    throw new ArgumentException(
                        $"Type '{t.PrettyPrint()}' is not an '{SubscribeSynchronousToType.PrettyPrint()}', '{SubscribeAsynchronousToType.PrettyPrint()}' or '{SubscribeSynchronousToAllType.PrettyPrint()}'"
                    );
                }

                foreach (var subscribeTo in subscribeTos)
                {
                    eventFlowOptions.ServiceCollection.AddTransient(subscribeTo, t);
                }
            }

            return eventFlowOptions;
        }

        private static bool IsSubscriberInterface(Type type)
        {
            if (type == SubscribeSynchronousToAllType)
            {
                return true;
            }

            var typeInfo = type.GetTypeInfo();
            if (!typeInfo.IsGenericType)
            {
                return false;
            }

            var genericTypeDefinition = type.GetGenericTypeDefinition();

            return genericTypeDefinition == SubscribeSynchronousToType
                || genericTypeDefinition == SubscribeAsynchronousToType;
        }
    }
}
