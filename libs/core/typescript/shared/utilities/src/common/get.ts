import { get as getExt } from "radash";
import { isEmpty, isObject, isUndefined } from "./type-checks";

/**
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place.
 *
 * @param obj - The object to query
 * @param path - The path of the property to get
 * @param defaultValue - The value returned for undefined resolved values
 * @returns Returns the resolved value
 */
export const get = <T>(obj?: T, path?: string, defaultValue?: unknown): any => {
  try {
    return !path || !obj ? defaultValue : getExt(obj, path, defaultValue);
  } catch (e) {
    return defaultValue;
  }
};

export const compact = <TValue>(value: TValue[]) =>
  Array.isArray(value) ? value.filter(Boolean) : [];

export const getField = <T>(
  obj: T,
  path?: string,
  defaultValue?: unknown
): any => {
  if (!path || !isObject(obj)) {
    return defaultValue;
  }

  const result = compact(path.split(/[,[\].]+?/)).reduce(
    (result, key) =>
      isEmpty(result) ? result : result[key as keyof NonNullable<unknown>],
    obj
  );

  return isUndefined(result) || result === obj
    ? isUndefined(obj[path as keyof T])
      ? defaultValue
      : obj[path as keyof T]
    : result;
};
