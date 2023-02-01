using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
	public class StringEntityId
    : EntityId<string>
	{
    protected StringEntityId(string value)
      : base(value)
    {
    }

    public override IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
      var result = base.Validate(validationContext);
      if (result != null)
        yield return (ValidationResult)result;

      if (string.IsNullOrEmpty(Value))
      {
          yield return GetValidationResult(typeof(ResultCodeValidation),
            ResultCodeValidation.IdentifierCannotBeNull);
      }
    }
	}
}
