using OpenSystem.Core.Domain.Common;

namespace OpenSystem.Core.Domain.Extensions
{
    public static class SourceIdExtensions
    {
        public static bool IsNone(this ISourceId sourceId)
        {
            return string.IsNullOrEmpty(sourceId?.Value);
        }
    }
}
