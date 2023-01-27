namespace OpenSystem.Core.DotNet.Domain.Extensions
{
    public static class IntegerExtensions
    {
        public static bool IsSet(this int value)
        {
            return value != 0;
        }

        public static bool IsSet(this int? value)
        {
            return value != null && value != 0;
        }
    }
}
