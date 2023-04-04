using OpenSystem.Core.Application.Sagas;

namespace OpenSystem.Core.Infrastructure.Sagas
{
    public class SagaContext : ISagaContext
    {
        public static ISagaContext Empty { get; } = new SagaContext();
    }
}
