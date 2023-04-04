namespace OpenSystem.Core.Application.Sagas
{
    public interface ISagaErrorHandler
    {
        Task<bool> HandleAsync(
            SagaId sagaId,
            SagaDetails sagaDetails,
            Exception exception,
            CancellationToken cancellationToken
        );
    }

    public interface ISagaErrorHandler<TSaga> : ISagaErrorHandler
        where TSaga : ISaga { }
}
