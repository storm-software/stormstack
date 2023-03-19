using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using OpenSystem.Core.Domain.Common;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Utilities;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
  public abstract class Entity<T>
    : Indexed<T>, IValidatableObject, ICloneable, IEntity<T>
  {
    public static bool operator ==(Entity<T> a,
      Entity<T> b)
    {
      if (a is null && b is null)
          return true;

      if (a is null || b is null)
          return false;

      return a.Equals(b);
    }

    public static bool operator !=(Entity<T> a,
      Entity<T> b)
    {
        return !(a == b);
    }

    public T Id { get; set; }

    public abstract Result SetId();

    public Result SetId(T id)
    {
      if (Id == null &&
        Id.Equals(default(T)))
      {
        if (id != null &&
          !id.Equals(default(T)))
          Id = id;
        else
          return SetId();
      }

      return Result.Success();
    }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var ret = InnerValidate(validationContext);
        if (ret.Failed)
            return GetValidationResult(ret).Yield();

        return Enumerable.Empty<ValidationResult>();
    }

    public object Clone()
    {
      var serialized = JsonSerializer.Serialize<Entity<T>>(this);
      return JsonSerializer.Deserialize<Entity<T>>(serialized);
    }

    public override bool Equals(object? obj)
    {
        if (!(obj is Entity<T> other))
            return false;

        if (ReferenceEquals(this, other))
            return true;

        if (ValueObject.GetUnproxiedType(this) != ValueObject.GetUnproxiedType(other))
            return false;

        if (IsTransient() || other.IsTransient())
            return false;

        return Id.Equals(other.Id);
    }

    public override int GetHashCode()
    {
      return (Id.ToString() + Id).GetHashCode();
    }

    /// <summary>
    /// Allow derived class to add validations
    /// </summary>
    protected virtual Result InnerValidate(ValidationContext validationContext)
    {
        return Result.Success();
    }

    protected ValidationResult GetValidationResult(Result ret)
    {
      return new ValidationResult(ResultCode.Serialize(ret.ResultCodeType,
        ret.Code));
    }

    protected ValidationResult GetValidationResult(Type resultCodeType,
      int code)
    {
      return GetValidationResult(Result.Failure(resultCodeType,
        code));
    }

    protected ValidationResult GetValidationResult(int code)
    {
      return GetValidationResult(typeof(ResultCodeValidation),
        code);
    }

    private bool IsTransient()
    {
      return Id is not null;
    }
  }

  public abstract class Entity
    : Entity<Guid>, IEntity, IIndexed
  {
    public override Result SetId()
    {
      if (Id == null ||
        Id.Equals(default(Guid)))
      {
        Id = GuidUtility.Instance.CreateGuid();
      }
      return Result.Success();
    }
  }
}
