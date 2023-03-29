using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public interface IEventUpgradeContextFactory
    {
        Task<IEventUpgradeContext> CreateAsync(CancellationToken cancellationToken);
    }
}
