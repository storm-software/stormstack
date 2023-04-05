using System.Text.Json;
using System.Text.RegularExpressions;

namespace OpenSystem.Core.Api.Extensions
{
    public static class StringExtensions
    {
        public static bool IsValidJson(this string text)
        {
            text = text.Trim();
            if (
                (text.StartsWith("{") && text.EndsWith("}"))
                || (text.StartsWith("[") && text.EndsWith("]"))
            )
            {
                try
                {
                    using var obj = JsonDocument.Parse(text);
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        public static (bool IsEncoded, string ParsedText) VerifyBodyContent(this string text)
        {
            try
            {
                using var obj = JsonDocument.Parse(text);
                return (true, obj != null ? obj.ToString() : string.Empty);
            }
            catch (Exception)
            {
                return (false, text);
            }
        }

        public static bool IsHtml(this string text)
        {
            Regex tagRegex = new Regex(@"<\s*([^ >]+)[^>]*>.*?<\s*/\s*\1\s*>");

            return tagRegex.IsMatch(text);
        }

        public static string ToCamelCase(this string str)
        {
            if (!string.IsNullOrEmpty(str) && str.Length > 1)
            {
                return Char.ToLowerInvariant(str[0]) + str.Substring(1);
            }

            return str;
        }
    }
}