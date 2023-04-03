using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Jobs
{
    public interface IJobScheduler
    {
        Task<JobId> ScheduleNowAsync(IJob job, CancellationToken cancellationToken);
        Task<JobId> ScheduleAsync(
            IJob job,
            DateTimeOffset runAt,
            CancellationToken cancellationToken
        );
        Task<JobId> ScheduleAsync(IJob job, TimeSpan delay, CancellationToken cancellationToken);
    }
}
