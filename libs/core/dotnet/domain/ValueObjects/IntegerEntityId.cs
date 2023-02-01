using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
	public class IntegerEntityId
    : EntityId<int>
	{
    protected IntegerEntityId(int value)
      : base(value)
    {
    }

    public override IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
      var result = base.Validate(validationContext);
      if (result != null)
        yield return (ValidationResult)result;

      if (!Value.IsSet())
      {
          yield return GetValidationResult(typeof(ResultCodeValidation),
            ResultCodeValidation.IdentifierCannotBeNull);
      }
    }
	}
}
