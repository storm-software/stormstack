using System;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Core.DotNet.Domain.ValueObjects;

namespace OpenSystem.Core.DotNet.Domain.Common
{
    public abstract class BaseEntity<TEntityId, TValueId>
      where TEntityId : EntityId<TValueId>
    {
    public virtual TEntityId Id { get; set; }

    private readonly List<BaseEvent> _domainEvents = new();

    [NotMapped]
    public IReadOnlyCollection<BaseEvent> DomainEvents => _domainEvents.AsReadOnly();

    public void AddDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void RemoveDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Remove(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }

    public override bool Equals(object? obj)
    {
        if (!(obj is BaseEntity<TEntityId, TValueId> other))
            return false;

        if (ReferenceEquals(this, other))
            return true;

        if (ValueObject.GetUnproxiedType(this) != ValueObject.GetUnproxiedType(other))
            return false;

        if (IsTransient() || other.IsTransient())
            return false;

        return Id.Equals(other.Id);
    }

    private bool IsTransient()
    {
        return Id is null || Id.Equals(default(TEntityId));
    }

    public static bool operator ==(BaseEntity<TEntityId, TValueId> a,
      BaseEntity<TEntityId, TValueId> b)
    {
        if (a is null && b is null)
            return true;

        if (a is null || b is null)
            return false;

        return a.Equals(b);
    }

    public static bool operator !=(BaseEntity<TEntityId, TValueId> a,
      BaseEntity<TEntityId, TValueId> b)
    {
        return !(a == b);
    }

    public override int GetHashCode()
    {
        return (ValueObject.GetUnproxiedType(this)?.ToString() + Id).GetHashCode();
    }
  }
}
