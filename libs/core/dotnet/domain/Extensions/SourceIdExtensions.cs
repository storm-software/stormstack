using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Extensions
{
    public static class SourceIdExtensions
    {
        public static bool IsNone(this SourceId sourceId)
        {
            return string.IsNullOrEmpty(sourceId?.Value);
        }
    }
}
