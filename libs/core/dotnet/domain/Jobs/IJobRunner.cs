using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Jobs
{
    public interface IJobRunner
    {
        Task ExecuteAsync(
            string jobName,
            uint version,
            string json,
            CancellationToken cancellationToken
        );
    }
}
