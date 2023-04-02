using System.Text.RegularExpressions;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Utilities;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public interface IValidatableValueObject<in TValue> : ISingleValueObject
    {
        IEnumerable<IFieldValidationResult> Validate(TValue value, string? fieldName = null);
    }
}
