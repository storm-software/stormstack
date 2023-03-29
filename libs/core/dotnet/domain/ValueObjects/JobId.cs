namespace OpenSystem.Core.Domain.ValueObjects
{
    public class JobId : Identity<JobId>
    {
        public JobId(string value)
            : base(value) { }

        public static implicit operator JobId(string guid) => new JobId(guid);

        public static implicit operator string(JobId jobId) => jobId.Value;
    }
}
