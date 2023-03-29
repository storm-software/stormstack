using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using OpenSystem.Core.Domain.Enums;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public abstract class SingleValueObject<TValue>
        : ValueObject,
            IComparable,
            ISingleValueObject,
            IComparable<SingleValueObject<TValue>>
    {
        private static readonly Type Type = typeof(TValue);

        private static readonly TypeInfo TypeInfo = typeof(TValue).GetTypeInfo();

        public static bool operator ==(SingleValueObject<TValue> a, SingleValueObject<TValue> b)
        {
            if (a is null && b is null)
                return true;

            if (a is null || b is null)
                return false;

            return a.Equals(b);
        }

        public static bool operator !=(SingleValueObject<TValue> a, SingleValueObject<TValue> b)
        {
            return !(a == b);
        }

        public static implicit operator SingleValueObject<TValue>(TValue value) => value;

        public static explicit operator TValue(SingleValueObject<TValue> valueObject) =>
            valueObject.Value;

        public TValue Value { get; }

        public SingleValueObject(TValue value)
            : base()
        {
            Value = value;
        }

        public int CompareTo(SingleValueObject<TValue>? other) => CompareTo(other as object);

        public override string ToString()
        {
            return ReferenceEquals(Value, null) ? string.Empty : Value.ToString();
        }

        public object GetValue()
        {
            return Value;
        }

        public override bool Equals(object? obj) => base.Equals(obj);

        public override int GetHashCode() => base.GetHashCode();

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
