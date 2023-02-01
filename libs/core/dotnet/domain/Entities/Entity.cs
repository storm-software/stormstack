using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public abstract class Entity<T> : IIndexed<T>, IAuditable
    {
      public T Id { get; set; }

      public int EventCounter { get; set; }

      public VerificationCodeTypes VerificationCode { get; set; }

      public string CreatedBy { get; set; }

      public DateTimeOffset CreatedDateTime { get; set; }

      public string? UpdatedBy { get; set; }

      public DateTimeOffset? UpdatedDateTime { get; set; }

      public override bool Equals(object? obj)
      {
          if (!(obj is Entity<T> other))
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
          return Id is not null;
      }

      public static bool operator ==(Entity<T> a,
        Entity<T> b)
      {
          if (a is null && b is null)
              return true;

          if (a is null || b is null)
              return false;

          return a.Equals(b);
      }

      public static bool operator !=(Entity<T> a,
        Entity<T> b)
      {
          return !(a == b);
      }

      public override int GetHashCode()
      {
          return (ValueObject.GetUnproxiedType(this)?.ToString() + Id).GetHashCode();
      }
   }
}
