using System.Text;

namespace OpenSystem.Core.Domain.Extensions
{
    public static class StringBuilderExtensions
    {
        public static StringBuilder AppendLineFormat(
            this StringBuilder stringBuilder,
            string format,
            params object[] args
        )
        {
            stringBuilder.AppendLine(string.Format(format, args));
            return stringBuilder;
        }
    }
}
