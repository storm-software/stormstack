using System.Text.Json.Serialization;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Application.Jobs
{
    [JsonConverter(typeof(SingleValueObjectConverter))]
    public class JobId : Identity<JobId>
    {
        public JobId(string value)
            : base(value) { }

        public static implicit operator JobId(string guid) => new JobId(guid);

        public static implicit operator string(JobId jobId) => jobId.Value;
    }
}
