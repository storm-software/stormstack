using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.ValueObjects;
using OpenSystem.Core.Application.Sagas;

namespace OpenSystem.Core.Infrastructure.Sagas
{
    public class SagaDefinitionService : ISagaDefinitionService
    {
        private static readonly IReadOnlyCollection<SagaDetails> Empty = new SagaDetails[] { };

        private readonly ILogger<SagaDefinitionService> _logger;

        private readonly ConcurrentDictionary<Type, SagaDetails> _sagaDetails =
            new ConcurrentDictionary<Type, SagaDetails>();

        private readonly ConcurrentDictionary<
            Type,
            List<SagaDetails>
        > _sagaDetailsByAggregateEvent = new ConcurrentDictionary<Type, List<SagaDetails>>();

        public SagaDefinitionService(
            ILogger<SagaDefinitionService> logger,
            ILoadedVersions<ISaga> loadedVersions
        )
        {
            _logger = logger;
            LoadSagas(loadedVersions.Items);
        }

        public void LoadSagas(params Type[] sagaTypes)
        {
            LoadSagas((IEnumerable<Type>)sagaTypes);
        }

        public void LoadSagas(IEnumerable<Type> sagaTypes)
        {
            foreach (var sagaType in sagaTypes)
            {
                if (_sagaDetails.ContainsKey(sagaType))
                {
                    _logger.LogWarning(
                        "Saga type {SagaType} has already been added, skipping it this time",
                        sagaType.PrettyPrint()
                    );
                    continue;
                }

                var sagaDetails = SagaDetails.From(sagaType);
                _sagaDetails[sagaType] = sagaDetails;

                foreach (var aggregateEventType in sagaDetails.AggregateEventTypes)
                {
                    var sagaDetailsList = _sagaDetailsByAggregateEvent.GetOrAdd(
                        aggregateEventType,
                        new List<SagaDetails>()
                    );

                    sagaDetailsList.Add(sagaDetails);
                }
            }
        }

        public IReadOnlyCollection<SagaDetails> GetSagaDetails(Type aggregateEventType)
        {
            return _sagaDetailsByAggregateEvent.TryGetValue(aggregateEventType, out var sagaDetails)
                ? sagaDetails
                : Empty;
        }
    }
}
