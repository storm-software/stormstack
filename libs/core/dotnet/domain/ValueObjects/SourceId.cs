namespace OpenSystem.Core.Domain.ValueObjects
{
    public class SourceId : Identity<SourceId>
    {
        public SourceId(string value)
            : base(value) { }

        public static implicit operator SourceId(string guid) => new SourceId(guid);

        public static implicit operator string(SourceId sourceId) => sourceId.Value;
    }
}
