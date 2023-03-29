namespace OpenSystem.Core.Domain.ValueObjects
{
    public class AggregateId : Identity<AggregateId>
    {
        public AggregateId(string value)
            : base(value) { }
    }
}
