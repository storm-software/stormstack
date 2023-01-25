using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace OpenSystem.Core.DotNet.Domain.Common
{
	public class EntityId
    : ValueObject
	{
		public readonly string Value;

    private EntityId(string value)
		{
			Value = value;
		}

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

		public static EntityId Create(string value)
		{
      return new EntityId(value);
		}

    public override IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
      if (string.IsNullOrEmpty(Value))
      {
          yield return new ValidationResult("The Identifier value cannot be null or empty.");
      }
    }
	}
}
