/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isPrimitive as isBaseTypeExternal,
  isFunction as isFunctionExternal,
  isNumber as isNumberExternal,
  isObject as isObjectExternal,
  isSymbol as isSymbolExternal
} from "radash";
import { MutableRefObject } from "react";
import zod from "zod";
import { EMPTY_STRING, ITyped, SelectOption } from "../types";
import { IMiddleware } from "./middleware";

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
 * Determine if the type is string and is empty
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is of type `""`
 */
export const isEmptyString = (obj: unknown): obj is string => {
  try {
    return isString(obj) && obj === EMPTY_STRING;
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
 * Check if the provided value's type is a built-in base type
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is a built-in base type
 *
 * @remarks **Base Types**: `number`, `string`, `boolean`, `symbol`, `bigint`, `undefined`, `null`
 */
export const isBaseType = (obj: unknown): boolean => {
  try {
    return isBaseTypeExternal(obj);
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
 * The inverse of the `isEmptyObject` function
 * @param obj - The value to type check
 * @returns An indicator specifying if the value provided is **NOT** of type `null` or `undefined` or `{}`
 */
export const isNotEmpty = (obj: unknown): obj is NonNullable<unknown> => {
  try {
    return !isEmpty(obj) && !isEmptyString(obj) && !isEmptyObject(obj);
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
    tag === "[object Error]" ||
    tag === "[object DOMException]" ||
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

// treat an empty string (`''`) as undefined
export const emptyString = <T extends zod.ZodType>(input: T) => {
  return zod.preprocess((value: unknown) => {
    if (value === "") return undefined;
    return value;
  }, input);
};

export const propertyIsOnObject = (object: any, property: string) => {
  try {
    return property in object;
  } catch (_) {
    return false;
  }
};

// Protects from prototype poisoning and unexpected merging up the prototype chain.
export const propertyIsUnsafe = (target: any, key: any) => {
  return (
    propertyIsOnObject(target, key) && // Properties are safe to merge if they don't exist in the target yet,
    !(
      Object.hasOwnProperty.call(target, key) && // unsafe if they exist up the prototype chain,
      Object.propertyIsEnumerable.call(target, key)
    )
  ); // and also unsafe if they're non-enumerable.
};

export const isMergeableObject = (value: any): boolean => {
  return isNonNullObject(value) && !isSpecialType(value);
};

export const isNonNullObject = (value: any) => {
  return !!value && typeof value === "object";
};

export const isSpecialType = (value: any) => {
  const stringValue = Object.prototype.toString.call(value);

  return (
    stringValue === "[object RegExp]" ||
    stringValue === "[object Date]" ||
    isReactElement(value)
  );
};

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
export const isReactElement = (value: any) => {
  return (
    value.$$typeof ===
    (typeof Symbol === "function" && Symbol.for
      ? Symbol.for("react.element")
      : 0xeac7)
  );
};

/**
 * Check if the provided value's type is "array-like"
 * @param obj - The value to type check
 * @returns An indicator specifying if the object provided is "array-like"
 */
export const isArrayLike = (value: any): boolean => {
  return (
    isObject(value) &&
    !isEmpty(value) &&
    "length" in value &&
    isNumber(value.length) &&
    (value.length === 0 ||
      (value.length > 0 &&
        Object.prototype.hasOwnProperty.call(value, value.length - 1)))
  );
};

/**
 * Check if the provided value's type is `IMiddleware`
 * @param obj - The value to type check
 * @returns An indicator specifying if the object provided is `IMiddleware`
 */
export const isMiddleware = (value: any): value is IMiddleware => {
  return isObject(value) && "handle" in value && isFunction(value.handle);
};

/**
 * Check if the provided value's type is `ITyped`
 * @param obj - The value to type check
 * @returns An indicator specifying if the object provided is `ITyped`
 */
export const isTyped = (value: any): value is ITyped => {
  return isObject(value) && "__typename" in value && isString(value.__typename);
};
