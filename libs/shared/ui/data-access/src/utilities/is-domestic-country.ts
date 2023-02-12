import { AddressConstants } from "../models";

export const isDomesticCountry = (
  countryCode?: string,
  defaultValue = true
): boolean => {
  return countryCode
    ? AddressConstants.DOMESTIC_COUNTRY_CODE === countryCode
    : defaultValue;
};
