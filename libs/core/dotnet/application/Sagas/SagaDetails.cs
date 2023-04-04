using System.Reflection;
using OpenSystem.Core.Domain.Extensions;

namespace OpenSystem.Core.Application.Sagas
{
    public class SagaDetails
    {
        public static SagaDetails From<T>()
            where T : ISaga
        {
            return From(typeof(T));
        }

        public static SagaDetails From(Type sagaType)
        {
            if (!typeof(ISaga).GetTypeInfo().IsAssignableFrom(sagaType))
            {
                throw new ArgumentException(
                    $"Type {sagaType.PrettyPrint()} is not a {typeof(ISaga).PrettyPrint()}",
                    nameof(sagaType)
                );
            }

            var sagaInterfaces = sagaType
                .GetTypeInfo()
                .GetInterfaces()
                .Select(i => i.GetTypeInfo())
                .ToList();
            var sagaHandlesTypes = sagaInterfaces
                .Where(
                    i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(ISagaHandles<,,>)
                )
                .ToList();
            var sagaStartedByTypes = sagaInterfaces
                .Where(
                    i =>
                        i.IsGenericType
                        && i.GetGenericTypeDefinition() == typeof(ISagaIsStartedBy<,,>)
                )
                .Select(i => i.GetGenericArguments()[2])
                .ToList();
            var aggregateEventTypes = sagaHandlesTypes
                .Select(i => i.GetGenericArguments()[2])
                .ToList();
            var sagaInterfaceType = sagaInterfaces.Single(
                i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(ISaga<>)
            );

            var sagaTypeDetails = new SagaDetails(
                sagaType,
                sagaInterfaceType.GetGenericArguments()[0],
                sagaStartedByTypes,
                aggregateEventTypes
            );

            return sagaTypeDetails;
        }

        private readonly ISet<Type> _startedBy;

        private SagaDetails(
            Type sagaType,
            Type sagaLocatorType,
            IEnumerable<Type> startedBy,
            IReadOnlyCollection<Type> aggregateEventTypes
        )
        {
            _startedBy = new HashSet<Type>(startedBy);

            SagaType = sagaType;
            SagaLocatorType = sagaLocatorType;
            AggregateEventTypes = aggregateEventTypes;
        }

        public Type SagaType { get; }

        public Type SagaLocatorType { get; }

        public IReadOnlyCollection<Type> AggregateEventTypes { get; }

        public bool IsStartedBy(Type aggregateEventType)
        {
            return _startedBy.Contains(aggregateEventType);
        }
    }
}
