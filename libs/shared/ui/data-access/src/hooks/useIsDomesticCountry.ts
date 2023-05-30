import { isDomesticCountry } from "../utilities/is-domestic-country";

export function useIsDomesticCountry(
  countryCode?: string,
  defaultValue = true
): boolean {
  return isDomesticCountry(countryCode, defaultValue);
}
