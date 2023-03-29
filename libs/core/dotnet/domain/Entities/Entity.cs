using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
    public abstract class Entity<TEntityId>
        : ValueObject,
            IIndexed<TEntityId>,
            ICloneable,
            IEntity<TEntityId>
        where TEntityId : EntityId
    {
        public static bool operator ==(Entity<TEntityId> a, Entity<TEntityId> b)
        {
            if (a is null && b is null)
                return true;

            if (a is null || b is null)
                return false;

            return a.Equals(b);
        }

        public static bool operator !=(Entity<TEntityId> a, Entity<TEntityId> b)
        {
            return !(a == b);
        }

        public TEntityId Id { get; set; } = default!;

        public ValueTask<Result> ValidateAsync()
        {
            return ValueTask.FromResult(InnerValidate(null));
        }

        public object Clone()
        {
            var serialized = JsonSerializer.Serialize<Entity<TEntityId>>(this);
            return JsonSerializer.Deserialize<Entity<TEntityId>>(serialized);
        }

        public override bool Equals(object? obj)
        {
            if (!(obj is Entity<TEntityId> other))
                return false;

            if (ReferenceEquals(this, other))
                return true;

            if (ValueObject.GetUnproxiedType(this) != ValueObject.GetUnproxiedType(other))
                return false;

            if (IsTransient() || other.IsTransient())
                return false;

            return Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return (Id.ToString() + Id).GetHashCode();
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Id;
        }

        /// <summary>
        /// Allow derived class to add validations
        /// </summary>
        protected virtual Result InnerValidate(ValidationContext? validationContext)
        {
            return Result.Success();
        }

        private bool IsTransient()
        {
            return Id is not null;
        }
    }
}
