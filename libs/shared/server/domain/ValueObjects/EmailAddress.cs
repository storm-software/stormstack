using System;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ValueObjects;
using OpenSystem.Shared.Domain.ResultCodes;
using System.Linq;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Shared.Domain.ValueObjects
{
    public class EmailAddress : SingleValueObject<string>
    {
        public EmailAddress(string value)
            : base(value) { }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }

        public static EmailAddress Create(string value)
        {
            return new EmailAddress(value);
        }

        public IEnumerable<IFieldValidationResult> Validate(string value, string? fieldName = null)
        {
            if (
                StringExtensions.IsSet(Value)
                && !new Regex(
                    @"^(([^<>()[\]\\.,;:\s@\""]+"
                        + @"(\.[^<>()[\]\\.,;:\s@\""]+)*)|(\"".+\""))@"
                        + @"((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}"
                        + @"\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+"
                        + @"[a-zA-Z]{2,}))$"
                ).IsMatch(Value)
            )
                yield return FieldValidationResult.Failure(
                    fieldName,
                    ResultCodeShared.InvalidEmailFormat,
                    value
                );
        }
    }
}
