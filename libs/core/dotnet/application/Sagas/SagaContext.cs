namespace OpenSystem.Core.Application.Sagas
{
    public class SagaContext : ISagaContext
    {
        public static ISagaContext Empty { get; } = new SagaContext();
    }
}
