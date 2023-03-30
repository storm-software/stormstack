using System;
using System.Collections.Concurrent;
using System.Linq.Expressions;
using System.Reflection;
using FluentValidation;
using FluentValidation.Results;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public abstract class ValueObject : IComparable, IComparable<ValueObject>
    {
        private static readonly ConcurrentDictionary<
            Type,
            IReadOnlyCollection<PropertyInfo>
        > TypeProperties = new ConcurrentDictionary<Type, IReadOnlyCollection<PropertyInfo>>();

        internal static Type? GetUnproxiedType(object? obj)
        {
            if (obj == null)
                return null;

            const string EFCoreProxyPrefix = "Castle.Proxies.";
            const string NHibernateProxyPostfix = "Proxy";

            Type type = obj.GetType();

            string typeString = type.ToString();
            if (
                typeString.Contains(EFCoreProxyPrefix)
                || typeString.EndsWith(NHibernateProxyPostfix)
            )
                return type.BaseType;

            return type;
        }

        public ValueObject()
        {
            //var context = new ValidationContext<object>(this);
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
            unchecked
            {
                return GetEqualityComponents()
                    .Aggregate(17, (current, obj) => current * 23 + (obj?.GetHashCode() ?? 0));
            }
        }

        public int CompareTo(object? obj)
        {
            Type? thisType = GetUnproxiedType(this);
            Type? otherType = GetUnproxiedType(obj);

            if (thisType != otherType)
                return string.Compare(
                    thisType?.ToString(),
                    otherType?.ToString(),
                    StringComparison.Ordinal
                );

            object[] components = GetEqualityComponents().ToArray();
            object[] otherComponents =
                obj != null ? ((ValueObject)obj).GetEqualityComponents().ToArray() : new object[0];

            for (int i = 0; i < components.Length; i++)
            {
                var other = otherComponents.Length > i ? otherComponents[i] : null;

                int comparison = CompareComponents(components[i], other);
                if (comparison != 0)
                    return comparison;
            }

            return 0;
        }

        protected virtual IEnumerable<object> GetEqualityComponents()
        {
            return GetProperties().Select(x => x.GetValue(this));
        }

        public virtual int CompareTo(ValueObject? other)
        {
            return CompareTo(other as object);
        }

        public override string ToString()
        {
            return $"{{{string.Join(", ", GetProperties().Select(f => $"{f.Name}: {f.GetValue(this)}"))}}}";
        }

        protected virtual IEnumerable<PropertyInfo> GetProperties()
        {
            return TypeProperties.GetOrAdd(
                GetType(),
                t =>
                    t.GetTypeInfo()
                        .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                        .OrderBy(p => p.Name)
                        .ToList()
            );
        }

        private int CompareComponents(object? object1, object? object2)
        {
            if (object1 is null && object2 is null)
                return 0;

            if (object1 is null)
                return -1;

            if (object2 is null)
                return 1;

            if (object1 is IComparable comparable1 && object2 is IComparable comparable2)
                return comparable1.CompareTo(comparable2);

            return object1.Equals(object2) ? 0 : -1;
        }
    }
}
