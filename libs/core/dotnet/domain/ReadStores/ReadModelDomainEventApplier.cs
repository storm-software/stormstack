using System.Collections.Concurrent;
using System.Reflection;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.ReadStores
{
    public class ReadModelDomainEventApplier : IReadModelDomainEventApplier
    {
        private const string ApplyMethodName = "ApplyAsync";

        private static readonly ConcurrentDictionary<
            Type,
            ConcurrentDictionary<Type, ApplyMethod>
        > ApplyMethods = new ConcurrentDictionary<Type, ConcurrentDictionary<Type, ApplyMethod>>();

        public async Task<bool> UpdateReadModelAsync<TReadModel>(
            TReadModel readModel,
            IReadOnlyCollection<IDomainEvent> domainEvents,
            IReadModelContext readModelContext,
            CancellationToken cancellationToken
        )
            where TReadModel : IReadModel
        {
            var readModelType = typeof(TReadModel);
            var appliedAny = false;

            foreach (var domainEvent in domainEvents)
            {
                var applyMethods = ApplyMethods.GetOrAdd(
                    readModelType,
                    t => new ConcurrentDictionary<Type, ApplyMethod>()
                );
                var applyMethod = applyMethods.GetOrAdd(
                    domainEvent.EventType,
                    t =>
                    {
                        var identityType = domainEvent.GetIdentity().GetType();
                        var aggregateType = domainEvent.AggregateType;
                        var eventType = typeof(IDomainEvent<,,>).MakeGenericType(
                            aggregateType,
                            identityType,
                            t
                        );

                        // first try: does it implement the synchronous 'Apply' method?

                        var interfaceType = typeof(IReadModelFor<,,>).MakeGenericType(
                            aggregateType,
                            identityType,
                            t
                        );
                        var methodParams = new[]
                        {
                            typeof(IReadModelContext),
                            eventType,
                            typeof(CancellationToken)
                        };
                        var methodInfo = GetMethod(
                            readModelType,
                            interfaceType,
                            ApplyMethodName,
                            methodParams
                        );

                        if (methodInfo != null)
                        {
                            var method = ReflectionHelper.CompileMethodInvocation<
                                Func<
                                    IReadModel,
                                    IReadModelContext,
                                    IDomainEvent,
                                    CancellationToken,
                                    Task
                                >
                            >(methodInfo);
                            return new ApplyMethod(method);
                        }

                        // no matching 'Apply' method found

                        return null;
                    }
                );

                if (applyMethod != null)
                {
                    await applyMethod
                        .Apply(readModel, readModelContext, domainEvent, cancellationToken)
                        .ConfigureAwait(false);
                    appliedAny = true;
                }
            }

            return appliedAny;
        }

        private static MethodInfo GetMethod(
            Type instanceType,
            Type interfaceType,
            string name,
            Type[] parameters
        )
        {
            var methodInfo = instanceType.GetTypeInfo().GetMethod(name, parameters);

            if (methodInfo != null)
            {
                return methodInfo;
            }

            var type = interfaceType.GetTypeInfo();
            return type.IsAssignableFrom(instanceType) ? type.GetMethod(name, parameters) : default;
        }

        private class ApplyMethod
        {
            private readonly Func<
                IReadModel,
                IReadModelContext,
                IDomainEvent,
                CancellationToken,
                Task
            > _method;

            public ApplyMethod(
                Func<IReadModel, IReadModelContext, IDomainEvent, CancellationToken, Task> method
            )
            {
                _method = method;
            }

            public Task Apply(
                IReadModel readModel,
                IReadModelContext context,
                IDomainEvent domainEvent,
                CancellationToken cancellationToken
            )
            {
                return _method(readModel, context, domainEvent, cancellationToken);
            }
        }
    }
}
