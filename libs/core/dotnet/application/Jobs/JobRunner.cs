using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Application.Jobs
{
    public class JobRunner : IJobRunner
    {
        private readonly IJobDefinitionService _jobDefinitionService;

        private readonly IJsonSerializer _jsonSerializer;

        private readonly IServiceProvider _serviceProvider;

        public JobRunner(
            IServiceProvider serviceProvider,
            IJobDefinitionService jobDefinitionService,
            IJsonSerializer jsonSerializer
        )
        {
            _serviceProvider = serviceProvider;
            _jobDefinitionService = jobDefinitionService;
            _jsonSerializer = jsonSerializer;
        }

        public Task ExecuteAsync(
            string jobName,
            ulong version,
            string json,
            CancellationToken cancellationToken
        )
        {
            if (!_jobDefinitionService.TryGetDefinition(jobName, version, out var jobDefinition))
                throw new GeneralProcessingException(
                    ResultCodeApplication.UnknownJob,
                    $"Could not find job '{jobName}' v{version}"
                );

            var executeCommandJob = (IJob)_jsonSerializer.Deserialize(json, jobDefinition.Type);
            return executeCommandJob.ExecuteAsync(_serviceProvider, cancellationToken);
        }
    }
}
