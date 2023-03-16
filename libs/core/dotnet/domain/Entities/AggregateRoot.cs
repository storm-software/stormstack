using OpenSystem.Core.Domain.Events;

namespace OpenSystem.Core.Domain.Entities
{
  public abstract class AggregateRoot
    : AuditableEntity, IAggregateRoot, ISoftDeleted
  {
    public IList<IDomainEvent> DomainEvents { get; } = new List<IDomainEvent>();

    public string? DeletedBy { get; set; }

    public DateTimeOffset? DeletedDateTime { get; set; }
  }
}
