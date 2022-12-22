/**
 * It converts a boolean value to a string
 * @param {boolean | null} [value] - The value to be converted to a string.
 */
export const stringifyBoolean = (value?: boolean | null): string =>
  String(!!value);

/**
 * It returns true if the string is "true" or "1", false if the string is "false" or "0", and false if
 * the string is anything else.
 * @param {string | null} [strValue] - string | null
 * @returns A function that takes a string and returns a boolean.
 */
export const parseBoolean = (strValue?: string | null): boolean => {
  try {
    return !!strValue && Boolean(JSON.parse(strValue));
  } catch (e) {
    return false;
  }
};
