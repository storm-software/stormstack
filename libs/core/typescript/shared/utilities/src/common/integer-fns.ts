import zod from "zod";
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

export const getRandomInt = (max: number): number =>
  Math.floor(Math.random() * max);

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomIntRange = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const numberFromNumberOrNumberString = (obj: unknown): number | undefined => {
  if (typeof obj == "number") return obj;
  if (isNumberString(obj)) return Number(obj);
};

export const NumberFromString = zod.preprocess(
  numberFromNumberOrNumberString,
  zod.number().min(1)
);

export const isNumberString = (obj: unknown) =>
  zod.string().regex(/^\d+$/).safeParse(obj).success;
