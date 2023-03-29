using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Sagas
{
    public class SagaId : Identity<SagaId>
    {
        public SagaId(string value)
            : base(value) { }

        public static implicit operator SagaId(string guid) => new SagaId(guid);

        public static implicit operator string(SagaId sagaId) => sagaId.Value;
    }
}
