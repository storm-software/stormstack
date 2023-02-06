import { get as getExt } from "radash";

/**
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place.
 *
 * @param obj - The object to query
 * @param path - The path of the property to get
 * @param defaultValue - The value returned for undefined resolved values
 * @returns Returns the resolved value
 */
export const get = <T>(obj?: T, path?: string, defaultValue?: unknown) => {
  try {
    return !path || !obj ? defaultValue : getExt(obj, path, defaultValue);
  } catch (e) {
    return defaultValue;
  }
};
