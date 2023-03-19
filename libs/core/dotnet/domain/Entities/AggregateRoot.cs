using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.Entities
{
  public abstract class AggregateRoot
    : SoftDeletedAuditableEntity, IAggregateRoot
  {
    public IList<IDomainEvent> DomainEvents { get; } = new List<IDomainEvent>();
  }
}
