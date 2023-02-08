import { AddressConstants } from "@open-system/shared-ui-data-access";

export function useIsDomesticCountry(
  countryCode?: string,
  defaultValue = true
): boolean {
  return countryCode
    ? AddressConstants.DOMESTIC_COUNTRY_CODE === countryCode
    : defaultValue;
}
