using System.Text.RegularExpressions;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public class AggregateName
        : SingleValueObject<string>,
            IAggregateName,
            IValidatableValueObject<string>
    {
        public AggregateName(string value)
            : base(value) { }

        public IEnumerable<FieldValidationResult> Validate(string value, string? fieldName = null)
        {
            if (string.IsNullOrWhiteSpace(value))
                yield return FieldValidationResult.Failure(
                    fieldName,
                    ResultCodeValidation.IdentifierCannotBeNull,
                    value
                );
            else if (!Regex.IsMatch(value, @"^[a-zA-Z0-9_\- ]+$"))
                yield return FieldValidationResult.Failure(
                    fieldName,
                    ResultCodeValidation.InvalidAggregateNameFormat,
                    value
                );
        }
    }
}
