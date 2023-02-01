using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
	public class EntityId<T>
    : ValueObject
	{
		public virtual T? Value { get; init; }

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
      if (Value is null ||
        Value.Equals(default(T)))
      {
          yield return GetValidationResult(typeof(ResultCodeValidation),
            ResultCodeValidation.IdentifierCannotBeNull);
      }
    }
	}
}
