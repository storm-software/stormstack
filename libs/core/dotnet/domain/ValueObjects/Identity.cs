using System.Text.RegularExpressions;
using FluentValidation;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public abstract class Identity<T> : SingleValueObject<string>, IIdentity
        where T : Identity<T>
    {
        private static readonly string Prefix;

        private static readonly Regex ValueValidation;

        private static Func<string, T> _createIdentityFunc;

        static Identity()
        {
            var name = typeof(T).Name;
            if (name.Equals("id", StringComparison.OrdinalIgnoreCase))
            {
                Prefix = string.Empty;
                ValueValidation = new Regex(
                    @"^(?<guid>[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12})$",
                    RegexOptions.Compiled
                );
            }
            else
            {
                var nameReplace = new Regex("Id$");
                Prefix = nameReplace.Replace(typeof(T).Name, string.Empty).ToLowerInvariant() + "-";
                ValueValidation = new Regex(
                    @"^[^\-]+\-(?<guid>[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12})$",
                    RegexOptions.Compiled
                );
            }
        }

        protected override Result InnerValidate(ValidationContext<object> validationContext)
        {
            if (Value is null || Value.Equals(default(T)))
                return Result.Failure(
                    typeof(ResultCodeValidation),
                    ResultCodeValidation.IdentifierCannotBeNull
                );

            return Result.Success();
        }

        public static T New => With(Guid.NewGuid());

        public static T NewDeterministic(Guid namespaceId, string name)
        {
            var guid = GuidUtility.Deterministic.CreateGuid(namespaceId, name);
            return With(guid);
        }

        public static T NewDeterministic(Guid namespaceId, byte[] nameBytes)
        {
            var guid = GuidUtility.Deterministic.CreateGuid(namespaceId, nameBytes);
            return With(guid);
        }

        public static T NewComb()
        {
            var guid = GuidUtility.Comb.CreateForString();
            return With(guid);
        }

        public static T With(string value)
        {
            _createIdentityFunc ??= ReflectionHelper.CompileConstructor<string, T>();

            return _createIdentityFunc(value);
        }

        public static T With(Guid guid)
        {
            var value = $"{Prefix}{guid:D}";
            return With(value);
        }

        public static bool IsValid(string value)
        {
            return !Validate(value).Any();
        }

        public static IEnumerable<string> Validate(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                yield return $"Identity of type '{typeof(T).PrettyPrint()}' is null or empty";
                yield break;
            }

            if (!string.Equals(value.Trim(), value, StringComparison.OrdinalIgnoreCase))
                yield return $"Identity '{value}' of type '{typeof(T).PrettyPrint()}' contains leading and/or trailing spaces";
            if (!string.IsNullOrEmpty(Prefix) && !value.StartsWith(Prefix))
                yield return $"Identity '{value}' of type '{typeof(T).PrettyPrint()}' does not start with '{Prefix}'";
            if (!ValueValidation.IsMatch(value))
                yield return $"Identity '{value}' of type '{typeof(T).PrettyPrint()}' does not follow the syntax '{Prefix}[GUID]' in lower case";
        }

        protected Identity(string value)
            : base(value)
        {
            var validationErrors = Validate(value).ToList();
            if (validationErrors.Any())
            {
                throw new ArgumentException(
                    $"Identity is invalid: {string.Join(", ", validationErrors)}"
                );
            }

            _lazyGuid = new Lazy<Guid>(
                () => Guid.Parse(ValueValidation.Match(Value).Groups["guid"].Value)
            );
        }

        private readonly Lazy<Guid> _lazyGuid;

        public Guid GetGuid() => _lazyGuid.Value;
    }
}
