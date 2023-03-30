using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public class SourceId : Identity<SourceId>, ISourceId
    {
        public SourceId(string value)
            : base(value) { }

        public static implicit operator SourceId(string guid) => new SourceId(guid);

        public static implicit operator string(SourceId sourceId) => sourceId.Value;

        public static explicit operator SourceId(EventId eventId) => (SourceId)eventId;
    }
}
