using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Events
{
    public class EventUpgradeContextFactory : IEventUpgradeContextFactory
    {
        public Task<IEventUpgradeContext> CreateAsync(CancellationToken _)
        {
            return Task.FromResult<IEventUpgradeContext>(new EventUpgradeContext());
        }
    }
}
