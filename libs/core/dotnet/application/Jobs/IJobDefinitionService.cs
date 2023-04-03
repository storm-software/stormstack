using OpenSystem.Core.Domain.Attributes;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Jobs
{
    public interface IJobDefinitionService
        : IVersionDefinitionService<JobVersionAttribute, JobDefinition> { }
}
