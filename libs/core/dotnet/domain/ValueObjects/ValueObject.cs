using System;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Reflection;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public abstract class ValueObject<TValue, TValueObject>
      : IComparable, IValidatableObject, IComparable<ValueObject<TValue, TValueObject>>
      where TValueObject : ValueObject<TValue, TValueObject>, new()
    {
        static ValueObject()
        {
            ConstructorInfo ctor = typeof(TValueObject)
                .GetTypeInfo()
                .DeclaredConstructors
                .First();

            var argsExp = new Expression[0];
            NewExpression newExp = Expression.New(ctor,
              argsExp);
            LambdaExpression lambda = Expression.Lambda(typeof(Func<TValueObject>),
              newExp);

            ValueObjectFactory = (Func<TValueObject>)lambda.Compile();
        }

        protected static readonly Func<TValueObject> ValueObjectFactory;

        public static TValueObject Create(TValue item)
        {
            TValueObject x = ValueObjectFactory();
            x.Value = item;
            var ret = x.InnerValidate();
            if (ret.Failed)
                throw new FailedResultException(ret);

            return x;
        }

        public static bool operator ==(ValueObject<TValue, TValueObject> a,
          ValueObject<TValue, TValueObject> b)
        {
            if (a is null && b is null)
                return true;

            if (a is null || b is null)
                return false;

            return a.Equals(b);
        }

        public static bool operator !=(ValueObject<TValue, TValueObject> a,
          ValueObject<TValue, TValueObject> b)
        {
            return !(a == b);
        }

        public static implicit operator ValueObject<TValue, TValueObject>(TValue value) => value;

        public static explicit operator TValue(ValueObject<TValue, TValueObject> valueObject) => valueObject.Value;

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

        [Key]
        public TValue Value { get; protected set; }

        private int? _cachedHashCode;


        public virtual IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
          var ret = InnerValidate();
          if (ret.Failed)
            yield return GetValidationResult(ret.ResultCodeType,
              ret.Code);

           yield break;
        }

        public override bool Equals(object? obj)
        {
            if (obj == null)
                return false;

            if (GetUnproxiedType(this) != GetUnproxiedType(obj))
                return false;

            return GetEqualityComponents()
              .SequenceEqual(((ValueObject<TValue, TValueObject>)obj)
              .GetEqualityComponents());
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
              ? ((ValueObject<TValue, TValueObject>)obj).GetEqualityComponents().ToArray()
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

        public virtual int CompareTo(ValueObject<TValue, TValueObject>? other)
        {
            return CompareTo(other as object);
        }

        public override string ToString()
        {
            return Value.ToString();
        }

        protected virtual IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }

        protected virtual Result InnerValidate()
        {
            return Result.Success();
        }

        protected ValidationResult GetValidationResult(Type resultCodeType,
          int code)
        {
          return new ValidationResult(ResultCode.Serialize(resultCodeType,
            code));
        }

        protected ValidationResult GetValidationResult(string resultCodeType,
          int code)
        {
          return new ValidationResult(ResultCode.Serialize(resultCodeType,
            code));
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
    }

    public class ValueObject
      : ValueObject<object, ValueObject>
    {
    }

    /// <summary>
    /// Use non-generic ValueObject whenever possible: http://bit.ly/vo-new
    /// </summary>
    /*public abstract class ValueObject<T>
        where T : ValueObject<T>
    {
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

        private int? _cachedHashCode;


        public override bool Equals(object? obj)
        {
            var valueObject = obj as T;
            if (valueObject is null)
                return false;

            if (ValueObject<T>.GetUnproxiedType(this) != ValueObject<T>.GetUnproxiedType(obj))
                return false;

            return EqualsCore(valueObject);
        }

        protected abstract bool EqualsCore(T other);

        protected abstract int GetHashCodeCore();

        public override int GetHashCode()
        {
            if (!_cachedHashCode.HasValue)
            {
                _cachedHashCode = GetHashCodeCore();
            }

            return _cachedHashCode.Value;
        }
    }*/
}
