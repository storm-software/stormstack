using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Application.Subscribers.Extensions
{
    public static class ServiceCollectionExtensions
    {
        private static readonly Type SubscribeSynchronousToType = typeof(ISubscribeSynchronousTo<
            ,,
        >);
        private static readonly Type SubscribeAsynchronousToType = typeof(ISubscribeAsynchronousTo<
            ,,
        >);
        private static readonly Type SubscribeSynchronousToAllType =
            typeof(ISubscribeSynchronousToAll);

        public static IServiceCollection AddSynchronousSubscriber<
            TAggregate,
            TIdentity,
            TEvent,
            TSubscriber
        >(this IServiceCollection services)
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TEvent : IAggregateEvent<TAggregate, TIdentity>
            where TSubscriber : class, ISubscribeSynchronousTo<TAggregate, TIdentity, TEvent>
        {
            services.AddTransient<
                ISubscribeSynchronousTo<TAggregate, TIdentity, TEvent>,
                TSubscriber
            >();
            return services;
        }

        public static IServiceCollection AddAsynchronousSubscriber<
            TAggregate,
            TIdentity,
            TEvent,
            TSubscriber
        >(this IServiceCollection services)
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
            where TEvent : IAggregateEvent<TAggregate, TIdentity>
            where TSubscriber : class, ISubscribeAsynchronousTo<TAggregate, TIdentity, TEvent>
        {
            services.AddTransient<
                ISubscribeAsynchronousTo<TAggregate, TIdentity, TEvent>,
                TSubscriber
            >();
            return services;
        }

        public static IServiceCollection AddSubscribers(
            this IServiceCollection services,
            params Type[] types
        )
        {
            return services.AddSubscribers((IEnumerable<Type>)types);
        }

        public static IServiceCollection AddSubscribers(
            this IServiceCollection services,
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
            return services.AddSubscribers(types);
        }

        public static IServiceCollection AddSubscribers(
            this IServiceCollection services,
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
                    services.AddTransient(subscribeTo, t);
                }
            }

            return services;
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
