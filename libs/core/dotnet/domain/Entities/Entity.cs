using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text.Json;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.ValueObjects;

namespace OpenSystem.Core.Domain.Entities
{
  public abstract class Entity<T>
    : IIndexed<T>, IValidatableObject, ICloneable
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
      return (ValueObject.GetUnproxiedType(this)?.ToString() + Id).GetHashCode();
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
        ret.Code ?? 0));
    }

    private bool IsTransient()
    {
      return Id is not null;
    }
  }
}
