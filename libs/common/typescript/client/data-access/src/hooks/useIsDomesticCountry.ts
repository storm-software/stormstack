import { isDomesticCountry } from "@stormstack/common-shared-data-access";

export function useIsDomesticCountry(
  countryCode?: string,
  defaultValue = true
): boolean {
  return isDomesticCountry(countryCode, defaultValue);
}
