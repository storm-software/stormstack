using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.Entities
{
    public interface IAggregateRoot
    {
      IList<IDomainEvent> DomainEvents { get; }
    }
}
