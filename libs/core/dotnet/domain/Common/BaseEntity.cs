using System;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Core.DotNet.Domain.ValueObjects;

namespace OpenSystem.Core.DotNet.Domain.Common
{
    public abstract class BaseEntity
    {
      public EntityId<Guid>? Id { get; init; }

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
          if (!(obj is BaseEntity other))
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
          return Id is null || Id.Value == default(Guid);
      }

      public static bool operator ==(BaseEntity a,
        BaseEntity b)
      {
          if (a is null && b is null)
              return true;

          if (a is null || b is null)
              return false;

          return a.Equals(b);
      }

      public static bool operator !=(BaseEntity a,
        BaseEntity b)
      {
          return !(a == b);
      }

      public override int GetHashCode()
      {
          return (ValueObject.GetUnproxiedType(this)?.ToString() + Id).GetHashCode();
      }
   }
}
