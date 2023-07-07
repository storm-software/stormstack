import { AddressConstants } from "../types";

export const isDomesticCountry = (
  countryCode?: string,
  defaultValue = true
): boolean => {
  return countryCode
    ? AddressConstants.DOMESTIC_COUNTRY_CODE === countryCode
    : defaultValue;
};
