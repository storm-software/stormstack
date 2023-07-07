import { isDomesticCountry } from "@open-system/common-shared-data-access";

export function useIsDomesticCountry(
  countryCode?: string,
  defaultValue = true
): boolean {
  return isDomesticCountry(countryCode, defaultValue);
}
