using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Jobs
{
    public class InstantJobScheduler : IJobScheduler
    {
        private readonly IJobDefinitionService _jobDefinitionService;

        private readonly IJobRunner _jobRunner;

        private readonly ILogger<InstantJobScheduler> _logger;

        private readonly IJsonSerializer _jsonSerializer;

        public InstantJobScheduler(
            ILogger<InstantJobScheduler> logger,
            IJsonSerializer jsonSerializer,
            IJobRunner jobRunner,
            IJobDefinitionService jobDefinitionService
        )
        {
            _logger = logger;
            _jsonSerializer = jsonSerializer;
            _jobRunner = jobRunner;
            _jobDefinitionService = jobDefinitionService;
        }

        public async Task<JobId> ScheduleNowAsync(IJob job, CancellationToken cancellationToken)
        {
            if (job == null)
                throw new ArgumentNullException(nameof(job));

            var jobDefinition = _jobDefinitionService.GetDefinition(job.GetType());

            try
            {
                var json = _jsonSerializer.Serialize(job);

                _logger.LogDebug(
                    "Executing job {JobName} v{JobVersion}: {Json}",
                    jobDefinition.Name,
                    jobDefinition.Version,
                    json
                );

                await _jobRunner
                    .ExecuteAsync(
                        jobDefinition.Name,
                        jobDefinition.Version,
                        json,
                        cancellationToken
                    )
                    .ConfigureAwait(false);
            }
            catch (Exception e)
            {
                // We want the InstantJobScheduler to behave as an out-of-process scheduler, i.e., doesn't
                // throw exceptions directly related to the job execution

                _logger.LogError(
                    e,
                    "Execution of job {JobName} v{JobVersion} failed due to {ExceptionType}: {ExceptionMessage}",
                    jobDefinition.Name,
                    jobDefinition.Version,
                    e.GetType().PrettyPrint(),
                    e.Message
                );
            }

            return JobId.New;
        }

        public Task<JobId> ScheduleAsync(
            IJob job,
            DateTimeOffset runAt,
            CancellationToken cancellationToken
        )
        {
            if (job == null)
            {
                throw new ArgumentNullException(nameof(job));
            }

            _logger.LogWarning(
                "Instant scheduling configured, executing job {JobType} NOW! Instead of at {RunAt}",
                job.GetType().PrettyPrint(),
                runAt
            );

            // Don't schedule, just execute...
            return ScheduleNowAsync(job, cancellationToken);
        }

        public Task<JobId> ScheduleAsync(
            IJob job,
            TimeSpan delay,
            CancellationToken cancellationToken
        )
        {
            if (job == null)
            {
                throw new ArgumentNullException(nameof(job));
            }

            _logger.LogWarning(
                "Instant scheduling configured, executing job {JobType} NOW! Instead of in {Delay}",
                job.GetType().PrettyPrint(),
                delay
            );

            // Don't schedule, just execute...
            return ScheduleNowAsync(job, cancellationToken);
        }
    }
}
