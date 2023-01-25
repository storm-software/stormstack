using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace OpenSystem.Core.DotNet.Domain.Common
{
    [Serializable]
    [StructLayout(LayoutKind.Sequential)]
    public readonly partial struct Maybe<T>
      : IEquatable<Maybe<T>>, IEquatable<object>, IMaybe<T>
    {

        private readonly bool _isValueSet;

        private readonly T _value;

        /// <summary>
        /// Returns the inner value if there's one, otherwise throws an InvalidOperationException with <paramref name="errorMessage"/>
        /// </summary>
        /// <exception cref="InvalidOperationException">Maybe has no value.</exception>
        public T GetValueOrThrow(string errorMessage = "Maybe has no value.")
        {
            if (HasNoValue)
                throw new InvalidOperationException(errorMessage);

            return _value;
        }

        public T GetValueOrDefault(T defaultValue = default)
        {
            if (HasNoValue)
                return defaultValue;

            return _value;
        }

        /// <summary>
        ///  Indicates whether the inner value is present and returns the value if it is.
        /// </summary>
        /// <param name="value">The inner value, if present; otherwise `default`</param>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public bool TryGetValue(
            out T value)
        {
            value = _value;
            return _isValueSet;
        }

        /// <summary>
        /// Try to use GetValueOrThrow() or GetValueOrDefault() instead for better explicitness.
        /// </summary>
        public T Value => GetValueOrThrow();

        public static Maybe<T> None => new Maybe<T>();

        public bool HasValue => _isValueSet;
        public bool HasNoValue => !HasValue;

        private Maybe(T value)
        {
            if (value == null)
            {
                _isValueSet = false;
                _value = default;
                return;
            }

            _isValueSet = true;
            _value = value;
        }

        public static implicit operator Maybe<T>(T value)
        {
            if (value is Maybe<T> m)
                return m;

            return Maybe.From(value);
        }

        public static implicit operator Maybe<T>(Maybe value) => None;

        public static Maybe<T> From(T obj)
        {
            return new Maybe<T>(obj);
        }

        public static bool operator ==(Maybe<T> maybe, T value)
        {
            if (value is Maybe<T>)
                return maybe.Equals(value);

            if (maybe.HasNoValue)
                return value is null;

            return maybe._value?.Equals(value) == true;
        }

        public static bool operator !=(Maybe<T> maybe,
          T value)
        {
            return !(maybe == value);
        }

        public static bool operator ==(Maybe<T> maybe,
          object other)
        {
            return maybe.Equals(other);
        }

        public static bool operator !=(Maybe<T> maybe,
          object other)
        {
            return !(maybe == other);
        }

        public static bool operator ==(Maybe<T> first,
          Maybe<T> second)
        {
            return first.Equals(second);
        }

        public static bool operator !=(Maybe<T> first,
          Maybe<T> second)
        {
            return !(first == second);
        }

        public override bool Equals(object? obj)
        {
            if (obj is null)
                return false;
            if (obj is Maybe<T> other)
                return Equals(other);
            if (obj is T value)
                return Equals(value);
            return false;
        }

        public bool Equals(Maybe<T> other)
        {
            if (HasNoValue && other.HasNoValue)
                return true;

            if (HasNoValue || other.HasNoValue)
                return false;

            return EqualityComparer<T>.Default.Equals(_value,
              other._value);
        }

        public override int GetHashCode()
        {
            if (HasNoValue || _value == null)
                return 0;

            return _value.GetHashCode();
        }

        public override string ToString()
        {
            if (HasNoValue)
                return "No value";

            return _value?.ToString() ?? "No value";
        }
    }

    /// <summary>
    /// Non-generic entrypoint for <see cref="Maybe{T}" /> members
    /// </summary>
    public readonly struct Maybe
    {
        public static Maybe None => new Maybe();

        /// <summary>
        /// Creates a new <see cref="Maybe{T}" /> from the
        /// provided <paramref name="value"/>
        /// </summary>
        public static Maybe<T> From<T>(T value) => Maybe<T>.From(value);
    }
}
