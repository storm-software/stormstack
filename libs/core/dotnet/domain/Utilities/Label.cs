using System.Text.RegularExpressions;

namespace OpenSystem.Core.Domain.Utilities
{
    public class Label
    {
        private static readonly Regex NameValidator = new Regex(
            @"^[\p{Ll}\p{Lm}\p{Lo}\p{Nd}\-]{3,}$",
            RegexOptions.Compiled
        );

        public static Label Named(string name) => new Label(name.ToLowerInvariant());

        public static Label Named(params string[] parts)
        {
            return Named(string.Join("-", parts));
        }

        public string Name { get; }

        private Label(string name)
        {
            if (string.IsNullOrEmpty(name))
                throw new ArgumentNullException(nameof(name));
            if (!NameValidator.IsMatch(name))
                throw new ArgumentException(
                    $"Label '{name}' is not a valid label, it must pass this regex '{NameValidator}'",
                    nameof(name)
                );

            Name = name;
        }

        public override string ToString()
        {
            return Name;
        }
    }
}
