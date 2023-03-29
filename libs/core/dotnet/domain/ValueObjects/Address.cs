using OpenSystem.Core.Domain.ResultCodes;
using OpenSystem.Core.Domain.Exceptions;
using FluentValidation;

namespace OpenSystem.Core.Domain.ValueObjects
{
    public class Address : SingleValueObject<AddressFields>
    {
        public Address(AddressFields value)
            : base(value) { }

        public Address(
            string addressLine1,
            string? addressLine2,
            string? city,
            string? state,
            string countryCode,
            string? postalCode
        )
            : base(
                new AddressFields(addressLine1, addressLine2, city, state, countryCode, postalCode)
            ) { }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value.AddressLine1;
            yield return Value.AddressLine2;
            yield return Value.City;
            yield return Value.State;
            yield return Value.CountryCode;
            yield return Value.PostalCode;
        }

        protected override Result InnerValidate(ValidationContext<object> validationContext)
        {
            var ret = base.InnerValidate(validationContext);
            if (ret.Failed)
                return ret;

            if (
                Value == null
                || string.IsNullOrEmpty(Value.AddressLine1)
                || string.IsNullOrEmpty(Value.AddressLine2)
                || string.IsNullOrEmpty(Value.City)
                || string.IsNullOrEmpty(Value.State)
                || string.IsNullOrEmpty(Value.CountryCode)
                || string.IsNullOrEmpty(Value.PostalCode)
            )
                return Result.Failure(
                    typeof(ResultCodeValidation),
                    ResultCodeValidation.IdentifierCannotBeNull
                );

            return Result.Success();
        }
    }

    public record AddressFields(
        string AddressLine1,
        string? AddressLine2,
        string? City,
        string? State,
        string CountryCode,
        string? PostalCode
    );
}
