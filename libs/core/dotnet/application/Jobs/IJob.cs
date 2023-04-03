using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Application.Jobs
{
    public interface IJob : IVersioned
    {
        Task ExecuteAsync(IServiceProvider serviceProvider, CancellationToken cancellationToken);
    }
}
