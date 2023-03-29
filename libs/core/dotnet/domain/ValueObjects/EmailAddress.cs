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
    public class EmailAddress : SingleValueObject<string>
    {
        public EmailAddress(string value)
            : base(value) { }

        protected override Result InnerValidate(ValidationContext<object> validationContext)
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
                return Result.Failure(
                    typeof(ResultCodeValidation),
                    ResultCodeValidation.InvalidEmailFormat
                );

            return Result.Success();
        }
    }
}
