"use client";

import {
  BaseComponentProps,
  InputAutoCompleteTypes,
} from "@open-system/design-system-components";
import { useFieldValue, useIsDomesticCountry } from "../hooks";
import { Input } from "../input";
import { Textarea } from "../textarea";

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
    <>
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
        required={required || countryCode}
      />
      <div className="flex flex-row gap-2">
        <div className="basis-3/5">
          <Input
            name="state"
            label={isDomesticCountry ? "State" : "Province / Region"}
            autoComplete={InputAutoCompleteTypes.STATE}
            maxLength={35}
            required={required || (countryCode && isDomesticCountry)}
          />
        </div>
        <div className="basis-2/5">
          <Input
            name="postalCode"
            label={isDomesticCountry ? "ZIP code" : "Postal code"}
            autoComplete={InputAutoCompleteTypes.POSTAL_CODE}
            maxLength={isDomesticCountry ? 5 : 9}
            required={required || (countryCode && isDomesticCountry)}
          />
        </div>
      </div>
    </>
  );
}
