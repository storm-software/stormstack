using System.Text.RegularExpressions;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public abstract class Identity<T>
        : SingleValueObject<string>,
            IIdentity,
            IValidatableValueObject<string>
        where T : Identity<T>
    {
        private static readonly string Prefix;

        private static readonly Regex ValueValidation;

        private static string FieldName = "Id";

        private static Func<string, T> _createIdentityFunc;

        static Identity()
        {
            FieldName = typeof(T).Name;
            if (FieldName.Equals("id", StringComparison.OrdinalIgnoreCase))
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
            return !InnerValidate(value).Any();
        }

        public IEnumerable<FieldValidationResult> Validate(string value, string? fieldName = null)
        {
            return InnerValidate(value, fieldName);
        }

        public static IEnumerable<FieldValidationResult> InnerValidate(
            string value,
            string? fieldName = null
        )
        {
            if (value is string strValue)
            {
                if (string.IsNullOrEmpty(strValue))
                    yield return FieldValidationResult.Failure(
                        fieldName,
                        ResultCodeValidation.IdentifierCannotBeNull,
                        $"Identity of type '{typeof(T).PrettyPrint()}' is null or empty",
                        strValue
                    );
                if (!string.Equals(strValue.Trim(), strValue, StringComparison.OrdinalIgnoreCase))
                    yield return FieldValidationResult.Failure(
                        fieldName,
                        ResultCodeValidation.InvalidIdentifier,
                        $"Identity '{strValue}' of type '{typeof(T).PrettyPrint()}' contains leading and/or trailing spaces",
                        strValue
                    );
                if (!string.IsNullOrEmpty(Prefix) && !strValue.StartsWith(Prefix))
                    yield return FieldValidationResult.Failure(
                        fieldName,
                        ResultCodeValidation.InvalidIdentifier,
                        $"Identity '{strValue}' of type '{typeof(T).PrettyPrint()}' does not start with '{Prefix}'",
                        strValue
                    );
                if (!ValueValidation.IsMatch(strValue))
                    yield return FieldValidationResult.Failure(
                        fieldName,
                        ResultCodeValidation.InvalidIdentifier,
                        $"Identity '{strValue}' of type '{typeof(T).PrettyPrint()}' does not follow the syntax '{Prefix}[GUID]' in lower case",
                        strValue
                    );
            }
            else if (value is null || value.Equals(default(T)))
            {
                yield return FieldValidationResult.Failure(
                    fieldName,
                    ResultCodeValidation.IdentifierCannotBeNull,
                    $"Identity of type '{typeof(T).PrettyPrint()}' is null or empty",
                    value?.ToString()
                );
            }
        }

        protected Identity(string value)
            : base(value)
        {
            _lazyGuid = new Lazy<Guid>(
                () => Guid.Parse(ValueValidation.Match(Value).Groups["guid"].Value)
            );
        }

        private readonly Lazy<Guid> _lazyGuid;

        public Guid GetGuid() => _lazyGuid.Value;
    }
}
