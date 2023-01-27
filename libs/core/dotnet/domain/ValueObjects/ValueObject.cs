using System;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.DotNet.Domain.Enums;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Domain.ValueObjects
{
    [Serializable]
    public abstract class ValueObject
      : IComparable, IValidatableObject, IComparable<ValueObject>
    {
        private int? _cachedHashCode;

        protected abstract IEnumerable<object> GetEqualityComponents();

        protected ValidationResult GetValidationResult(Type resultCodeType,
          int code)
        {
          return new ValidationResult(ResultCode.Serialize(resultCodeType,
            code));
        }

        public virtual IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            return Enumerable.Empty<ValidationResult>();
        }

        public override bool Equals(object? obj)
        {
            if (obj == null)
                return false;

            if (GetUnproxiedType(this) != GetUnproxiedType(obj))
                return false;

            return GetEqualityComponents()
              .SequenceEqual(((ValueObject)obj).GetEqualityComponents());
        }

        public override int GetHashCode()
        {
            if (!_cachedHashCode.HasValue)
            {
                _cachedHashCode = GetEqualityComponents()
                    .Aggregate(1,
                      (current, obj) =>
                    {
                        unchecked
                        {
                            return current * 23 + (obj?.GetHashCode() ?? 0);
                        }
                    });
            }

            return _cachedHashCode.Value;
        }

        public virtual int CompareTo(object? obj)
        {
            Type? thisType = GetUnproxiedType(this);
            Type? otherType = GetUnproxiedType(obj);

            if (thisType != otherType)
                return string.Compare(thisType?.ToString(),
                  otherType?.ToString(),
                  StringComparison.Ordinal);

            object[] components = GetEqualityComponents().ToArray();
            object[] otherComponents = obj != null
              ? ((ValueObject)obj).GetEqualityComponents().ToArray()
              : new object[0];

            for (int i = 0; i < components.Length; i++)
            {
                var other = otherComponents.Length > i
                  ? otherComponents[i]
                  : null;

                int comparison = CompareComponents(components[i],
                  other);
                if (comparison != 0)
                    return comparison;
            }

            return 0;
        }

        private int CompareComponents(object? object1,
          object? object2)
        {
            if (object1 is null &&
              object2 is null)
                return 0;

            if (object1 is null)
                return -1;

            if (object2 is null)
                return 1;

            if (object1 is IComparable comparable1 &&
              object2 is IComparable comparable2)
                return comparable1.CompareTo(comparable2);

            return object1.Equals(object2) ? 0 : -1;
        }

        public virtual int CompareTo(ValueObject? other)
        {
            return CompareTo(other as object);
        }

        public static bool operator ==(ValueObject a,
          ValueObject b)
        {
            if (a is null && b is null)
                return true;

            if (a is null || b is null)
                return false;

            return a.Equals(b);
        }

        public static bool operator !=(ValueObject a,
          ValueObject b)
        {
            return !(a == b);
        }

        internal static Type? GetUnproxiedType(object? obj)
        {
            if (obj == null)
              return null;

            const string EFCoreProxyPrefix = "Castle.Proxies.";
            const string NHibernateProxyPostfix = "Proxy";

            Type type = obj.GetType();

            string typeString = type.ToString();
            if (typeString.Contains(EFCoreProxyPrefix) ||
              typeString.EndsWith(NHibernateProxyPostfix))
                return type.BaseType;

            return type;
        }
    }

    /// <summary>
    /// Use non-generic ValueObject whenever possible: http://bit.ly/vo-new
    /// </summary>
    [Serializable]
    public abstract class ValueObject<T>
        where T : ValueObject<T>
    {
        private int? _cachedHashCode;

        public override bool Equals(object? obj)
        {
            var valueObject = obj as T;
            if (valueObject is null)
                return false;

            if (ValueObject.GetUnproxiedType(this) != ValueObject.GetUnproxiedType(obj))
                return false;

            return EqualsCore(valueObject);
        }

        protected abstract bool EqualsCore(T other);

        public override int GetHashCode()
        {
            if (!_cachedHashCode.HasValue)
            {
                _cachedHashCode = GetHashCodeCore();
            }

            return _cachedHashCode.Value;
        }

        protected abstract int GetHashCodeCore();

        public static bool operator ==(ValueObject<T> a,
          ValueObject<T> b)
        {
            if (a is null && b is null)
                return true;

            if (a is null || b is null)
                return false;

            return a.Equals(b);
        }

        public static bool operator !=(ValueObject<T> a,
          ValueObject<T> b)
        {
            return !(a == b);
        }
    }
}
