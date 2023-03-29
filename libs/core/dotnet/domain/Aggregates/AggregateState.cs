using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Domain.Aggregates
{
    public abstract class AggregateState<TAggregate, TIdentity, TEventApplier>
        : IEventApplier<TAggregate, TIdentity>
        where TEventApplier : class, IEventApplier<TAggregate, TIdentity>
        where TAggregate : IAggregateRoot<TIdentity>
        where TIdentity : IIdentity
    {
        private static readonly IReadOnlyDictionary<
            Type,
            Action<TEventApplier, IAggregateEvent>
        > ApplyMethods;

        static AggregateState()
        {
            ApplyMethods = typeof(TEventApplier).GetAggregateEventApplyMethods<
                TAggregate,
                TIdentity,
                TEventApplier
            >();
        }

        protected AggregateState()
        {
            var me = this as TEventApplier;
            if (me == null)
            {
                throw new InvalidOperationException(
                    $"Event applier of type '{GetType().PrettyPrint()}' has a wrong generic argument '{typeof(TEventApplier).PrettyPrint()}'"
                );
            }
        }

        public bool Apply(
            TAggregate aggregate,
            IAggregateEvent<TAggregate, TIdentity> aggregateEvent
        )
        {
            var aggregateEventType = aggregateEvent.GetType();
            if (
                !ApplyMethods.TryGetValue(
                    aggregateEventType,
                    out Action<TEventApplier, IAggregateEvent>? applier
                )
            )
                return false;

            if (applier == null)
                throw new InvalidOperationException(
                    $"Event applier of type '{GetType().PrettyPrint()}' has a null apply method for event type '{aggregateEventType.PrettyPrint()}'"
                );

            applier((TEventApplier)(object)this, aggregateEvent);
            return true;
        }
    }
}
