using System;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;
using OpenSystem.Core.Domain.Extensions;
using OpenSystem.Core.Domain.ValueObjects;
using System.Linq;
using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;

namespace OpenSystem.Core.Domain.ValueObjects
{
	public class Address
    : ValueObject<AddressFields, Address>
	{  
    public static Address Create(string addressLine1,
      string? addressLine2,
      string? city,
      string? state,
      string countryCode,
      string? postalCode)
    {
        return Address.Create(new AddressFields(addressLine1,
          addressLine2,
          city,
          state,
          countryCode,
          postalCode));
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value.AddressLine1;
        yield return Value.AddressLine2;
        yield return Value.City;
        yield return Value.State;
        yield return Value.CountryCode;
        yield return Value.PostalCode;                  
    }

    protected override Result InnerValidate()
    {
      var ret = base.InnerValidate();
      if (ret.Failed)
        return ret;

      if (Value == null ||
        string.IsNullOrEmpty(Value.AddressLine1) ||
        string.IsNullOrEmpty(Value.AddressLine2) ||
        string.IsNullOrEmpty(Value.City) ||
        string.IsNullOrEmpty(Value.State) ||
        string.IsNullOrEmpty(Value.CountryCode) ||
        string.IsNullOrEmpty(Value.PostalCode))
        return Result.Failure(typeof(ResultCodeValidation),
            ResultCodeValidation.IdentifierCannotBeNull);

      return Result.Success();
    }
	}

  public record AddressFields(string AddressLine1,
    string? AddressLine2,
    string? City,
    string? State,
    string CountryCode,
    string? PostalCode);
}
