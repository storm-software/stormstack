using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Jobs
{
    public interface IJobRunner
    {
        Task ExecuteAsync(
            string jobName,
            ulong version,
            string json,
            CancellationToken cancellationToken
        );
    }
}
