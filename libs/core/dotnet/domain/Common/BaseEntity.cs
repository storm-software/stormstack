using System;

namespace OpenSystem.Core.DotNet.Domain.Common
{
    public abstract class BaseEntity<TEntityId>
      where TEntityId : EntityId
    {
        public virtual TEntityId Id { get; set; }

        public override bool Equals(object? obj)
        {
            if (!(obj is BaseEntity<TEntityId> other))
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

        public static bool operator ==(BaseEntity<TEntityId> a,
          BaseEntity<TEntityId> b)
        {
            if (a is null && b is null)
                return true;

            if (a is null || b is null)
                return false;

            return a.Equals(b);
        }

        public static bool operator !=(BaseEntity<TEntityId> a,
          BaseEntity<TEntityId> b)
        {
            return !(a == b);
        }

        public override int GetHashCode()
        {
            return (ValueObject.GetUnproxiedType(this)?.ToString() + Id).GetHashCode();
        }
    }
}
