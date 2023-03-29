using Microsoft.Extensions.DependencyInjection;
using OpenSystem.Core.Domain.Extensions;
using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace OpenSystem.Core.Domain.Events
{
    public class EventUpgradeContext : IEventUpgradeContext
    {
        protected ConcurrentDictionary<Type, IEnumerable> EventUpgrades { get; } =
            new ConcurrentDictionary<Type, IEnumerable>();

        public virtual bool TryGetUpgraders(
            Type aggregateType,
            out IReadOnlyCollection<IEventUpgrader> upgraders
        )
        {
            if (!EventUpgrades.TryGetValue(aggregateType, out var u))
            {
                upgraders = null;
                return false;
            }

            upgraders = (IReadOnlyCollection<IEventUpgrader>)u;
            return true;
        }

        public virtual void AddUpgraders(
            Type aggregateType,
            IReadOnlyCollection<IEventUpgrader> upgraders
        )
        {
            if (!EventUpgrades.TryAdd(aggregateType, upgraders))
            {
                throw new ArgumentOutOfRangeException(
                    nameof(aggregateType),
                    $"Upgraders for {aggregateType.PrettyPrint()} already added"
                );
            }
        }
    }
}
