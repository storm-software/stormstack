using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Application.Jobs
{
    public interface IJobDefinitionService
        : IVersionDefinitionService<JobVersionAttribute, JobDefinition> { }
}
