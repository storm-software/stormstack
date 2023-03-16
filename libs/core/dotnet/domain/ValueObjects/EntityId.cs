using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.Exceptions;
using OpenSystem.Core.Domain.ResultCodes;

namespace OpenSystem.Core.Domain.ValueObjects
{
	public class EntityId<TValue>
    : ValueObject<TValue, EntityId<TValue>>
	{
    public static implicit operator EntityId<TValue>(EntityId entityId) => entityId;

    public static implicit operator EntityId(EntityId<TValue> entityId) => entityId;

    protected override Result InnerValidate()
    {
      if (Value is null ||
        Value.Equals(default(TValue)))
          return Result.Failure(typeof(ResultCodeValidation),
            ResultCodeValidation.IdentifierCannotBeNull);

      return Result.Success();
    }
	}

  public class EntityId
    : EntityId<Guid>
	{
    public static implicit operator EntityId(Guid guid) => guid;

    public static implicit operator Guid(EntityId entityId) => entityId.Value;

    protected override Result InnerValidate()
    {
      if (Value.Equals(default(Guid)))
          return Result.Failure(typeof(ResultCodeValidation),
            ResultCodeValidation.IdentifierCannotBeNull);

      return InnerValidate();
    }
	}
}
