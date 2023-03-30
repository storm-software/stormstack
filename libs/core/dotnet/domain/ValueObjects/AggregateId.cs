namespace OpenSystem.Core.Domain.ValueObjects
{
    public class AggregateId<T> : Identity<T>
        where T : AggregateId<T>
    {
        public AggregateId(string value)
            : base(value) { }
    }

    public class AggregateId : AggregateId<AggregateId>
    {
        public AggregateId(string value)
            : base(value) { }
    }
}
