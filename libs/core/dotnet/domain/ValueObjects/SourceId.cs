using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public class SourceId : Identity<SourceId>, ISourceId
    {
        public static new ISourceId New => new SourceId(Guid.NewGuid().ToString("D"));

        public SourceId(string value)
            : base(value)
        {
            if (string.IsNullOrEmpty(value))
                throw new ArgumentNullException(nameof(value));
        }
    }
}
