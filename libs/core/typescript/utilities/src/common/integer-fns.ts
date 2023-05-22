import { isEmpty } from "./type-checks";

/**
 * A function that takes a string and returns a number.
 * @param {string | number | null} [strValue] - string | number | null
 * @returns A number parsed from the input string.
 */
export const parseInteger = (
  strValue?: string | null | number,
  defaultValue = -1
): number => {
  try {
    const result = isEmpty(strValue)
      ? defaultValue
      : typeof strValue === "string"
      ? parseInt(`${strValue}`, 10)
      : Number.isNaN(strValue)
      ? defaultValue
      : strValue;
    if (!Number.isSafeInteger(result)) {
      return defaultValue;
    }

    return result as number;
  } catch (e) {
    return defaultValue;
  }
};
