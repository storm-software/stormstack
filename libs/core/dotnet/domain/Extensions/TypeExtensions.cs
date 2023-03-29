using System.Collections.Concurrent;
using System.Reflection;
using System;
using System.Collections.Generic;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.Events;
using OpenSystem.Core.Domain.Aggregates;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Extensions
{
    public static class TypeExtensions
    {
        private static readonly ConcurrentDictionary<Type, string> PrettyPrintCache =
            new ConcurrentDictionary<Type, string>();

        public static string PrettyPrint(this Type type)
        {
            return PrettyPrintCache.GetOrAdd(
                type,
                t =>
                {
                    try
                    {
                        return PrettyPrintRecursive(t, 0);
                    }
                    catch (Exception)
                    {
                        return t.Name;
                    }
                }
            );
        }

        private static readonly ConcurrentDictionary<Type, string> TypeCacheKeys =
            new ConcurrentDictionary<Type, string>();

        public static string GetCacheKey(this Type type)
        {
            return TypeCacheKeys.GetOrAdd(type, t => $"{t.PrettyPrint()}[hash: {t.GetHashCode()}]");
        }

        private static string PrettyPrintRecursive(Type type, int depth)
        {
            if (depth > 3)
            {
                return type.Name;
            }

            var nameParts = type.Name.Split('`');
            if (nameParts.Length == 1)
            {
                return nameParts[0];
            }

            var genericArguments = type.GetTypeInfo().GetGenericArguments();
            return !type.IsConstructedGenericType
                ? $"{nameParts[0]}<{new string(',', genericArguments.Length - 1)}>"
                : $"{nameParts[0]}<{string.Join(",", genericArguments.Select(t => PrettyPrintRecursive(t, depth + 1)))}>";
        }

        private static readonly ConcurrentDictionary<Type, AggregateName> AggregateNames =
            new ConcurrentDictionary<Type, AggregateName>();

        public static AggregateName GetAggregateName(this Type aggregateType)
        {
            return AggregateNames.GetOrAdd(
                aggregateType,
                t =>
                {
                    if (!typeof(IAggregateRoot).GetTypeInfo().IsAssignableFrom(aggregateType))
                    {
                        throw new ArgumentException(
                            $"Type '{aggregateType.PrettyPrint()}' is not an aggregate root"
                        );
                    }

                    return new AggregateName(
                        t.GetTypeInfo()
                            .GetCustomAttributes<AggregateNameAttribute>()
                            .SingleOrDefault()
                            ?.Name ?? t.Name
                    );
                }
            );
        }

        public static bool HasConstructorParameterOfType(this Type type, Predicate<Type> predicate)
        {
            return type.GetTypeInfo()
                .GetConstructors()
                .Any(c => c.GetParameters().Any(p => predicate(p.ParameterType)));
        }

        public static bool IsAssignableTo<T>(this Type type)
        {
            return typeof(T).GetTypeInfo().IsAssignableFrom(type);
        }

        public static IReadOnlyDictionary<
            Type,
            Action<T, IAggregateEvent>
        > GetAggregateEventApplyMethods<TAggregate, TIdentity, T>(this Type type)
            where TAggregate : IAggregateRoot<TIdentity>
            where TIdentity : IIdentity
        {
            var aggregateEventType = typeof(IAggregateEvent<TAggregate, TIdentity>);

            return type.GetTypeInfo()
                .GetMethods(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
                .Where(mi =>
                {
                    if (
                        !string.Equals(mi.Name, "Apply", StringComparison.Ordinal)
                        && !mi.Name.EndsWith(".Apply", StringComparison.Ordinal)
                    )
                    {
                        return false;
                    }

                    var parameters = mi.GetParameters();
                    return parameters.Length == 1
                        && aggregateEventType
                            .GetTypeInfo()
                            .IsAssignableFrom(parameters[0].ParameterType);
                })
                .ToDictionary(
                    mi => mi.GetParameters()[0].ParameterType,
                    mi =>
                        ReflectionHelper.CompileMethodInvocation<Action<T, IAggregateEvent>>(
                            type,
                            mi.Name,
                            mi.GetParameters()[0].ParameterType
                        )
                );
        }
    }
}
