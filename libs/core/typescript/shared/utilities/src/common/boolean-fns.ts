/**
 * It converts a boolean value to a string
 * @param {boolean | null} [value] - The value to be converted to a string.
 */
export const stringifyBoolean = (value?: boolean | null): string =>
  String(!!value);

/**
 * It returns true if the string is "true" or "1", false if the string is "false" or "0", and false if
 * the string is anything else.
 * @param {string | boolean | null} [strValue] - string | boolean | null
 * @returns A function that takes a string and returns a boolean.
 */
export const parseBoolean = (strValue?: string | null | boolean): boolean => {
  try {
    return typeof strValue === "boolean"
      ? strValue
      : !!strValue && Boolean(JSON.parse(strValue));
  } catch (e) {
    return false;
  }
};

/**
 * It returns true if the string is "true" or "1", false if the string is "false" or "0", and false if
 * the string is anything else.
 * @param {string | boolean | null} [strValue] - string | boolean | null
 * @returns A function that takes a string and returns a boolean.
 */
export const formatBoolean = (value?: string | boolean | null): string =>
  parseBoolean(value) ? "Yes" : "No";
