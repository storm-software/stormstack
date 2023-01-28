using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.DotNet.Domain.Extensions;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Domain.ValueObjects
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
