using Microsoft.Extensions.Logging;
using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Settings;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Jobs
{
    public class JobDefinitionService
        : BaseVersionDefinitionService<IJob, JobVersionAttribute, JobDefinition>,
            IJobDefinitionService
    {
        public JobDefinitionService(
            ILogger<JobDefinitionService> logger,
            ILoadedVersions loadedVersions
        )
            : base(logger)
        {
            Load(loadedVersions.Jobs);
        }

        protected override JobDefinition CreateDefinition(uint version, Type type, string name)
        {
            return new JobDefinition(version, type, name);
        }
    }
}
