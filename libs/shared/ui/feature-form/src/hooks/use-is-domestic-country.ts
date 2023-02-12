import { isDomesticCountry } from "@open-system/shared-ui-data-access";

export function useIsDomesticCountry(
  countryCode?: string,
  defaultValue = true
): boolean {
  return isDomesticCountry(countryCode, defaultValue);
}
