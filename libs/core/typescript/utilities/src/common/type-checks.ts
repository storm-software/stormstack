/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isFunction as isFunctionExternal,
  isNumber as isNumberExternal,
  isObject as isObjectExternal,
  isPrimitive as isPrimitiveExternal,
  isSymbol as isSymbolExternal,
} from "radash";
import { MutableRefObject } from "react";
import { SelectOption } from "../types";

/**
 * Check if the provided value's type is `number`
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `number`
 */
export const isNumber = (obj: unknown): obj is number => {
  try {
    return (
      obj instanceof Number || typeof obj === "number" || isNumberExternal(obj)
    );
  } catch (e) {
    return false;
  }
};

/**
 * Determine if the type is string
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `string`
 */
export const isString = (obj: unknown): obj is string => {
  try {
    return typeof obj === "string";
  } catch (e) {
    return false;
  }
};

/**
 * Check if the provided value's type is `Symbol`
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `Symbol`
 */
export const isSymbol = (obj: unknown): obj is symbol => {
  try {
    return (
      obj instanceof Symbol || typeof obj === "symbol" || isSymbolExternal(obj)
    );
  } catch (e) {
    return false;
  }
};

/**
 * Check if the provided value's type is a primary type
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is a primary type
 *
 * @remarks **Primitive Types**: `number`, `string`, `boolean`, `symbol`, `bigint`, `undefined`, `null`
 */
export const isPrimitive = (obj: unknown): boolean => {
  try {
    return isPrimitiveExternal(obj);
  } catch (e) {
    return false;
  }
};

/**
 * Gets the `toStringTag` of `obj`.
 *
 * @param obj The obj to query.
 * @returns Returns the `toStringTag`.
 */
const getTag = (obj: unknown): string => {
  if (obj == null) {
    return obj === undefined ? "[object Undefined]" : "[object Null]";
  }
  return Object.prototype.toString.call(obj);
};

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @param  value The value to check.
 * @returns Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * isObjectLike({})
 * // => true
 *
 * isObjectLike([1, 2, 3])
 * // => true
 *
 * isObjectLike(Function)
 * // => false
 *
 * isObjectLike(null)
 * // => false
 */
const isObjectLike = (obj: unknown) => {
  return typeof obj === "object" && obj !== null;
};

/**
 * Checks if `obj` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @param obj The value to check.
 * @returns Returns `true` if `obj` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1
 * }
 *
 * isPlainObject(new Foo)
 * // => false
 *
 * isPlainObject([1, 2, 3])
 * // => false
 *
 * isPlainObject({ 'x': 0, 'y': 0 })
 * // => true
 *
 * isPlainObject(Object.create(null))
 * // => true
 */
export const isPlainObject = (obj: unknown) => {
  if (!isObjectLike(obj) || getTag(obj) != "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(obj) === null) {
    return true;
  }
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
};

/**
 * Check if the provided value's type is `Object`
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `Object`
 */
export const isObject = (obj: unknown): obj is object => {
  try {
    return isObjectExternal(obj) || isPlainObject(obj);
  } catch (e) {
    return false;
  }
};

/**
 * Check if the provided value's type is `undefined`
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `undefined`
 */
export const isUndefined = (obj: unknown) => {
  try {
    return obj === undefined;
  } catch (e) {
    return false;
  }
};

/**
 * Check if the provided value's type is `null`
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `null`
 */
export const isNull = (obj: unknown) => {
  try {
    return obj === null;
  } catch (e) {
    return false;
  }
};

/**
 * Check if the provided value's type is `null` or `undefined`
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `null` or `undefined`
 */
export const isEmpty = (obj: unknown) => {
  try {
    return isUndefined(obj) || isNull(obj);
  } catch (e) {
    return false;
  }
};

/**
 * Check if the provided value's type is `null` or `undefined` or `{}`
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `null` or `undefined` or `{}`
 */
export const isEmptyObject = (obj: unknown) => {
  try {
    return isEmpty(obj) || Object.keys(obj ?? {}).length === 0;
  } catch (e) {
    return true;
  }
};

/**
 * The inverse of the `isEmpty` function
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is **NOT** of type `null` or `undefined`
 */
export const isSet = (obj: unknown): obj is NonNullable<unknown> => {
  try {
    return !isEmpty(obj);
  } catch (e) {
    return false;
  }
};

/**
 * Check if the provided value's type is `Function`
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `Function`
 */
export const isFunction = (
  obj: unknown
): obj is (params?: unknown) => unknown => {
  try {
    return (
      obj instanceof Function ||
      typeof obj === "function" ||
      isFunctionExternal(obj)
    );
  } catch (e) {
    return false;
  }
};

/**
 * Check if the provided value's type is a promise
 * @param obj - The value to type check
 * @returns An indicator specifying if the object provided is of type a promise
 */
export const isPromise = (value: unknown): value is Promise<unknown> => {
  return isObject(value) && isFunction((value as Promise<unknown>)?.then);
};

/**
 * Check if the provided value's type is SelectOption
 * @param obj - The value to type check
 * @returns An indicator specifying if the object provided is of type SelectOption
 */
export const isSelectOption = (obj: unknown): obj is SelectOption => {
  try {
    return (
      !isEmpty((obj as SelectOption)?.name) && "value" in (obj as SelectOption)
    );
  } catch (e) {
    return false;
  }
};

/**
 * Check if the provided value's type is a ref
 * @param obj - The value to type check
 * @returns An indicator specifying if the object provided is of type ref
 */
export const isRef = <TRef = unknown>(
  obj: unknown
): obj is MutableRefObject<TRef> => {
  try {
    return (obj as MutableRefObject<TRef>)?.current !== undefined;
  } catch (e) {
    return false;
  }
};

/**
 * Checks if `obj` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @param obj The obj to check.
 * @returns Returns `true` if `obj` is an error object, else `false`.
 * @example
 *
 * isError(new Error)
 * // => true
 *
 * isError(Error)
 * // => false
 */
export const isError = (obj: unknown): obj is Error => {
  if (!isObject(obj)) {
    return false;
  }

  const tag = getTag(obj);
  return (
    tag == "[object Error]" ||
    tag == "[object DOMException]" ||
    (typeof (obj as Error)?.message === "string" &&
      typeof (obj as Error)?.name === "string" &&
      !isPlainObject(obj))
  );
};

/**
 * Checks if `obj` is classified as a `Date` object.
 *
 * @param obj The obj to check.
 * @returns Returns `true` if `obj` is a date object, else `false`.
 * @example
 *
 * isDate(new Date)
 * // => true
 *
 * isDate('Mon April 23 2012')
 * // => false
 */
export const isDate = (obj: unknown): obj is Date =>
  isObjectLike(obj) && getTag(obj) == "[object Date]";

/**
 * Checks if `obj` is classified as a `bigint` object.
 *
 * @param obj The obj to check.
 * @returns Returns `true` if `obj` is a bigint object, else `false`.
 * @example
 *
 * isDate(37n)
 * // => true
 *
 * isBigInt(37)
 * // => false
 */
export const isBigInt = (obj: unknown): obj is bigint =>
  typeof obj === "bigint" || getTag(obj) == "[object BigInt]";

/**
 * Determine if the type is string and is not empty (length greater than zero)
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `string` and length greater than zero
 */
export const isStringSet = (obj: unknown): obj is NonNullable<string> => {
  try {
    return isSet(obj) && isString(obj) && obj.length > 0;
  } catch (e) {
    return false;
  }
};
