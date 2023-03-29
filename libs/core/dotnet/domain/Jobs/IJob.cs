using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Jobs
{
    public interface IJob : IVersioned
    {
        Task ExecuteAsync(IServiceProvider serviceProvider, CancellationToken cancellationToken);
    }
}
