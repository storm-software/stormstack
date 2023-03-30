using System;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ValueObjects;
using System.Linq;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using FluentValidation;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public class EmailAddress : SingleValueObject<string>, IValidatableValueObject<string>
    {
        public EmailAddress(string value)
            : base(value) { }

        public IEnumerable<FieldValidationResult> Validate(string value, string? fieldName = null)
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
                    ResultCodeValidation.InvalidEmailFormat,
                    null,
                    value
                );
        }
    }
}
