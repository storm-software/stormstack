using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.ReadStores
{
    public class ReadModelUpdate
    {
        public string ReadModelId { get; }

        public IReadOnlyCollection<IDomainEvent> DomainEvents { get; }

        public ReadModelUpdate(string readModelId, IReadOnlyCollection<IDomainEvent> domainEvents)
        {
            ReadModelId = readModelId;
            DomainEvents = domainEvents;
        }
    }
}
