using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Application.Jobs;

namespace OpenSystem.Core.Infrastructure.Jobs
{
    public class JobDefinitionService
        : BaseVersionDefinitionService<IJob, JobVersionAttribute, JobDefinition>,
            IJobDefinitionService
    {
        public JobDefinitionService(
            ILogger<JobDefinitionService> logger,
            ILoadedVersions<IJob> loadedVersions
        )
            : base(logger)
        {
            Load(loadedVersions.Items);
        }

        protected override JobDefinition CreateDefinition(ulong version, Type type, string name)
        {
            return new JobDefinition(version, type, name);
        }
    }
}