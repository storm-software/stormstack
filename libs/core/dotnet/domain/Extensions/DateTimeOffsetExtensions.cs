using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Core.Domain.Extensions
{
    public static class DateTimeOffsetExtensions
    {
        public static long ToUnixTime(this DateTimeOffset dateTimeOffset)
        {
            return Convert.ToInt64(
                (
                    dateTimeOffset.UtcDateTime - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                ).TotalSeconds
            );
        }
    }
}
