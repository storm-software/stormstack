using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.Jobs
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

        protected override JobDefinition CreateDefinition(uint version, Type type, string name)
        {
            return new JobDefinition(version, type, name);
        }
    }
}
