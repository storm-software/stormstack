/* eslint-disable @typescript-eslint/no-explicit-any */

import { Temporal } from "@js-temporal/polyfill";

/**
 * Tokens used to identify a specific defined type during the dependency injection process
 */
export const Tokens = {
  RESULT: Symbol.for("OS_RESULT_SYMBOL"),
  DATE_TIME: Symbol.for("OS_DATE_TIME_SYMBOL"),
  HTTP_CONFIG: Symbol.for("OS_HTTP_CONFIG_SYMBOL"),
  HTTP_LIBRARY: Symbol.for("OS_HTTP_LIBRARY_SYMBOL"),
  HTTP_MIDDLEWARE: Symbol.for("OS_HTTP_MIDDLEWARE_SYMBOL"),
  HTTP_SERVER_CONFIG: Symbol.for("OS_HTTP_SERVER_CONFIG_SYMBOL"),
  API_REQUEST_FACTORY: Symbol.for("OS_API_REQUEST_FACTORY_SYMBOL"),
  COOKIE_PARSER: Symbol.for("OS_COOKIE_PARSER_SYMBOL")
};

/**
 * The valid types of the index for an `Indexable` type object
 */
export type IndexType = string | number | symbol;

/**
 * The declaration of a ***dictionary-type*** object
 */
export type Indexable = {
  [index: IndexType]: any;
};

export const EMPTY_STRING = "" as const;
export const NEWLINE_STRING = "\r\n" as const;
export const EMPTY_OBJECT = {} as const;

export type AnyCase<T extends IndexType> = string extends T
  ? string
  : T extends `${infer F1}${infer F2}${infer R}`
  ? `${Uppercase<F1> | Lowercase<F1>}${
      | Uppercase<F2>
      | Lowercase<F2>}${AnyCase<R>}`
  : T extends `${infer F}${infer R}`
  ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}`
  : typeof EMPTY_STRING;

export type Newable<T> = new (...args: never[]) => T;

export interface Abstract<T> {
  prototype: T;
}

export interface Clonable<T> {
  clone(): T;
}

export type MaybePromise<T> = T | Promise<T>;

export interface ILogger {
  /**
   * Log success message
   */
  success: (...message: any[]) => any;

  /**
   * Log error message
   */
  error: (...message: any[]) => any;

  /**
   * Log warn message
   */
  warn: (...message: any[]) => any;

  /**
   * Log info message
   */
  info: (...message: any[]) => any;

  /**
   * Log debug message
   */
  debug: (...message: any[]) => any;
}

export interface IError extends Error {
  /**
   * Additional information to display in an extended area below the message bar
   */
  extendedMessage?: string;
}

export interface AbortError extends IError {
  name: "abort";
  message: "Aborted";
}

/**
 * Values representing the origin of a result returned/thrown in the application
 *
 * @defaultValueResultSourceTypes.UNKNOWN
 */
export enum ResultSourceTypes {
  UNKNOWN = 0,
  RENDERING = 1,
  SERVER = 2,
  EXCEPTION = 3,
  VALIDATION = 4,
  ABORTED = 5
}

export type ReducerFunction<TState, TAction> = (
  state: TState,
  action: TAction
) => TState;

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

// NOTE: for the file size optimization
export const TYPE_ARGUMENTS = "Arguments";
export const TYPE_ARRAY = "Array";
export const TYPE_OBJECT = "Object";
export const TYPE_MAP = "Map";
export const TYPE_SET = "Set";

export type Collection =
  | IArguments
  | Array<unknown>
  | Map<unknown, unknown>
  | Record<string | number | symbol, unknown>
  | Set<unknown>;

export interface SelectOption {
  /**
   * 	The string value to display in the field
   */
  name: string;

  /**
   * The value stored behind the scenes when selected
   */
  value: string;

  /**
   * Is the option value valid for selection in the dropdown
   */
  disabled: boolean;

  /**
   * Sets or retrieves whether the option in the list box is the default item.
   */
  selected: boolean;
}

export const enum DateTimeFormatTemplates {
  DATE_SERIALIZED = "yyyyMMdd",
  TIME_SERIALIZED = "HH:mm:ss",
  DATE_TIME_SERIALIZED = "yyyyMMdd HH:mm:ss",
  TIME_SERIALIZED_TWOFOUR = "HHmmss",
  DATE_TIME_SERIALIZED_TWOFOUR = "yyyyMMddHHmmss",
  DATE_TIME_DISPLAY = "MM/dd/yyyy h:mm:ss a",
  DATE_DISPLAY = "MM/dd/yyyy",
  TIME_DISPLAY = "h:mm:ss a",
  TIME_DISPLAY_SHORT = "h:mm a",
  DATE_INPUT_FORMAT = "MM/DD/YYYY",
  TIME_INPUT_FORMAT = "HH:MM:SS",
  DD_MM_YYYY = "DD-MM-YYYY",
  YYYY_DD_MM = "YYYY-DD-MM",
  YYYY_MM_DD = "YYYY-MM-DD",
  DD_MM_YY = "DD-MM-YY",
  YY_DD_MM = "YY-DD-MM",
  YY_MM_DD = "YY-MM-DD",
  DD_MM_YYYY_HH_MM_SS = "DD-MM-YYYY HH:MM:SS",
  YYYY_DD_MM_HH_MM_SS = "YYYY-DD-MM HH:MM:SS",
  YYYY_MM_DD_HH_MM_SS = "YYYY-MM-DD HH:MM:SS",
  DD_MM_YY_HH_MM_SS = "DD-MM-YY HH:MM:SS",
  YY_DD_MM_HH_MM_SS = "YY-DD-MM",
  YY_MM_DD_HH_MM_SS = "YY-MM-DD HH:MM:SS",
  DD__MM__YYYY = "DD/MM/YYYY",
  YYYY__DD__MM = "YYYY/DD/MM",
  YYYY__MM__DD = "YYYY/MM/DD",
  DD__MM__YY = "DD/MM/YY",
  YY__DD__MM = "YY/DD/MM",
  YY__MM__DD = "YY/MM/DD",
  DD__MM__YYYY_HH_MM_SS = "DD/MM/YYYY HH:MM:SS",
  YYYY__DD__MM_HH_MM_SS = "YYYY/DD/MM HH:MM:SS",
  YYYY__MM__DD_HH_MM_SS = "YYYY/MM/DD HH:MM:SS",
  DD__MM__YY_HH_MM_SS = "DD/MM/YY HH:MM:SS",
  YY__DD__MM_HH_MM_SS = "YY/DD/MM",
  YY__MM__DD_HH_MM_SS = "YY/MM/DD HH:MM:SS"
}

/**
 * Represents an HTTP file which will be transferred from or to a server.
 */
// export type HttpFile = Blob & { readonly name: string };

declare const $NestedValue: unique symbol;
/**
 * @deprecated to be removed in the next major version
 */
export type NestedValue<TValue extends object = object> = {
  [$NestedValue]: never;
} & TValue;

interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
interface FileList {
  readonly length: number;
  item(index: number): File | null;
  [index: number]: File;
}

export type LiteralUnion<T extends U, U extends BaseType> =
  | T
  | (U & {
      _?: never;
    });

/**
 * Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
 *
 * @category Type
 */
export type BaseType =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type BrowserNativeObject = Date | FileList | File;

export type EmptyObject = {
  [K in string | number]: never;
};

export type NonUndefined<T> = T extends undefined ? never : T;

export type DeepPartial<T> = T extends BrowserNativeObject | NestedValue
  ? T
  : {
      [K in keyof T]?: DeepPartial<T[K]>;
    };

export type Rollback = Record<
  string,
  (initialValue: any, currentValue: any) => any
>;

export interface FileState extends File {
  fileId: string;
  type: string;
  dataUrl?: string;
  data?: string;
}

/**
 * Extract all required keys from the given type.
 *
 * @remarks This is useful when you want to create a new type that contains different type values for the required keys only or use the list of keys for validation purposes, etc...
 * @category Utilities
 */
export type RequiredKeysOf<BaseType extends object> = Exclude<
  {
    [Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]>
      ? Key
      : never;
  }[keyof BaseType],
  undefined
>;

/**
 * Returns a boolean for whether the two given types are equal.
 *
 * @remarks Use-cases: If you want to make a conditional branch based on the result of a comparison of two types.
 * @link https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
 * @link https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796
 * @category Type Guard
 * @category Utilities
 */
export type IsEqual<A, B> = (<G>() => G extends A ? 1 : 2) extends <
  G
>() => G extends B ? 1 : 2
  ? true
  : false;

type Filter<KeyType, ExcludeType> = IsEqual<KeyType, ExcludeType> extends true
  ? never
  : KeyType extends ExcludeType
  ? never
  : KeyType;

type ExceptOptions = {
  /**
    Disallow assigning non-specified properties.

    Note that any omitted properties in the resulting type will be present in autocomplete as `undefined`.

    @default false
    */
  requireExactProps?: boolean;
};

/**
 * Create a type from an object type without certain keys.
 *
 * @remarks We recommend setting the `requireExactProps` option to `true`.
 * @remarks This type is a stricter version of [`Omit`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type). The `Omit` type does not restrict the omitted keys to be keys present on the given type, while `Except` does. The benefits of a stricter type are avoiding typos and allowing the compiler to pick up on rename refactors automatically.
 * @remarks This type was proposed to the TypeScript team, which declined it, saying they prefer that libraries implement stricter versions of the built-in types ([microsoft/TypeScript#30825](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235)).
 * @category Object
 */
export type Except<
  ObjectType,
  KeysType extends keyof ObjectType,
  Options extends ExceptOptions = { requireExactProps: false }
> = {
  [KeyType in keyof ObjectType as Filter<
    KeyType,
    KeysType
  >]: ObjectType[KeyType];
} & (Options["requireExactProps"] extends true
  ? Partial<Record<KeysType, never>>
  : {});

/**
 * Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aide with assignability.
 *
 * @remarks Sometimes it is desired to pass a value as a function argument that has a different type. At first inspection it may seem assignable, and then you discover it is not because the `value`'s type definition was defined as an interface. In the following example, `fn` requires an argument of type `Record<string, unknown>`. If the value is defined as a literal, then it is assignable. And if the `value` is defined as type using the `Simplify` utility the value is assignable.  But if the `value` is defined as an interface, it is not assignable because the interface is not sealed and elsewhere a non-string property could be added to the interface.
 * @remarks If the type definition must be an interface (perhaps it was defined in a third-party npm package), then the `value` can be defined as `const value: Simplify<SomeInterface> = ...`. Then `value` will be assignable to the `fn` argument.  Or the `value` can be cast as `Simplify<SomeInterface>` if you can't re-declare the `value`.
 * @link https://github.com/microsoft/TypeScript/issues/15300
 * @category Object
 */
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

/**
 * Create a type that makes the given keys required. The remaining keys are kept as is. The sister of the `SetOptional` type.
 *
 * @remarks Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are required.
 * @category Object
 */
export type SetRequired<BaseType, Keys extends keyof BaseType> =
  // `extends unknown` is always going to be the case and is used to convert any
  // union into a [distributive conditional
  // type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  BaseType extends unknown
    ? Simplify<
        // Pick just the keys that are optional from the base type.
        Except<BaseType, Keys> &
          // Pick the keys that should be required from the base type and make them required.
          Required<Pick<BaseType, Keys>>
      >
    : never;

export interface IIdentity<T = string> {
  id: T;
}

export interface IVersioned {
  version: number;
}

export interface ISequenced {
  /**
   * The sequence number (version, or event counter, etc.) of the record
   */
  sequence: number;
}

export interface ITyped {
  /**
   * A string representation of the class
   */
  __typename: string;

  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  __base: string;
}

export interface IBaseClass extends ITyped {}

export interface IBaseUtilityClass extends IBaseClass {
  /**
   * A symbol representing the class type
   */
  __symbol: symbol;

  /**
   * Returns back a hash code to identify this specific instance
   *
   * @remarks The combination of class name and Id
   */
  getHashCode: () => string;

  /**
   * The `isEqualInstance` method is comparing the hash codes of two instances of the `BaseUtilityClass`
   * class. It takes another instance of `BaseClass` as a parameter and checks if the hash code of
   * the current instance is equal to the hash code of the other instance. If the hash codes are equal,
   * it means that the two instances are considered equal.
   *
   * @param other - The other instance of `BaseClass` to compare with
   * @returns A boolean value indicating if the two instances are equal
   */
  isEqualInstance: (other: any) => boolean;
}

export type IResult<
  TErr extends IError | null = null,
  TData = unknown
> = IBaseUtilityClass & {
  /**
   * The source of the error
   */
  source: ResultSourceTypes;

  /**
   * Any data returned from the process/function
   */
  data?: TData | null;

  /**
   *  A generic error type.
   */
  error: TErr | null;

  /**
   * Can the application reset the state automatically through the error boundary when the error occurs
   *
   * @defaultValue `true`
   */
  isResettable: boolean;

  /**
   * A function to check if the provided object is an error
   */
  isError: () => boolean;

  /**
   * A function to check if the provided object was successful
   */
  isSuccess: () => boolean;

  /**
   * A function to check if the provided object is the same type of result of the calling result
   */
  isEqual: (result?: unknown) => boolean;

  /**
   * The date-time the result occurred
   */
  timestamp: IDateTime;
};

/**
 * Wrap the `Temporal.Instant` object so we can re-use it in other places
 */
export interface IDateTime extends Temporal.Instant, IBaseUtilityClass {
  /**
   * It returns the current `DateTime` object as a string for serialization
   * @returns A `string` to use for serialization
   */
  stringify(): string;
}

export const CONFIG_TOKEN = Symbol.for("CONFIG_TOKEN");
export const MIDDLEWARE_STACK_SYMBOL = Symbol("MIDDLEWARE_STACK_SYMBOL");
