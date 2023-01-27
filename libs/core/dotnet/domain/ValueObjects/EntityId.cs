using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.DotNet.Domain.ResultCodes;

namespace OpenSystem.Core.DotNet.Domain.ValueObjects
{
	public class EntityId<T>
    : ValueObject
	{
		public readonly T Value;

    protected EntityId(T value)
		{
			Value = value;
		}

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

		public static EntityId<T> Create(T value)
		{
      return new EntityId<T>(value);
		}

    public override IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
      if (Value != null)
      {
          yield return GetValidationResult(typeof(ResultCodeValidation),
            ResultCodeValidation.IdentifierCannotBeNull);
      }
    }
	}
}
