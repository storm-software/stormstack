namespace OpenSystem.Core.Application.Sagas
{
    public interface ISagaDefinitionService
    {
        void LoadSagas(params Type[] sagaTypes);

        void LoadSagas(IEnumerable<Type> sagaTypes);

        IReadOnlyCollection<SagaDetails> GetSagaDetails(Type aggregateEventType);
    }
}
