using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public interface IEventUpgradeContext
    {
        bool TryGetUpgraders(Type aggregateType, out IReadOnlyCollection<IEventUpgrader> upgraders);

        void AddUpgraders(Type aggregateType, IReadOnlyCollection<IEventUpgrader> upgraders);
    }
}
