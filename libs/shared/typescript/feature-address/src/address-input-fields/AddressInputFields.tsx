"use client";

import {
  BaseComponentProps,
  InputAutoCompleteTypes,
} from "@open-system/design-system-components";
import { useIsDomesticCountry } from "@open-system/shared-data-access";
import { Input, Textarea } from "@open-system/core-feature-form";
import { useFieldValue } from "@open-system/core-data-access";

export type AddressInputFieldsProps = BaseComponentProps & {
  required?: boolean;
};

export function AddressInputFields({
  required = true,
  ...props
}: AddressInputFieldsProps) {
  const countryCode = useFieldValue("countryCode");
  const isDomesticCountry = useIsDomesticCountry(countryCode);

  return (
    <div className="flex flex-col gap-0">
      <Input
        name="countryCode"
        label="Country"
        autoComplete={InputAutoCompleteTypes.COUNTRY}
        maxLength={50}
        required={required}
      />
      <Textarea
        name="addressLine1"
        label="Address"
        autoComplete={InputAutoCompleteTypes.ADDRESS}
        maxLength={50}
        required={required || countryCode}
      />
      <Input
        name="city"
        label="City"
        autoComplete={InputAutoCompleteTypes.CITY}
        maxLength={50}
        required={countryCode && isDomesticCountry}
      />
      <div className="flex flex-row gap-4">
        <div className="basis-3/5">
          <Input
            name="state"
            label={isDomesticCountry ? "State" : "Province / Region"}
            autoComplete={InputAutoCompleteTypes.STATE}
            maxLength={50}
            required={countryCode && isDomesticCountry}
          />
        </div>
        <div className="basis-2/5">
          <Input
            name="postalCode"
            label={isDomesticCountry ? "ZIP code" : "Postal code"}
            autoComplete={InputAutoCompleteTypes.POSTAL_CODE}
            minLength={5}
            maxLength={isDomesticCountry ? 5 : 9}
            required={countryCode && isDomesticCountry}
          />
        </div>
      </div>
    </div>
  );
}
