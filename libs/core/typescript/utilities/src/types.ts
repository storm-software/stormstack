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
  COOKIE_PARSER: Symbol.for("OS_COOKIE_PARSER_SYMBOL"),
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

export interface ICustomUtilityClass {
  /**
   * The object instance Id
   */
  _id: string;

  /**
   * A symbol representing the class type
   */
  _symbol: symbol;

  /**
   * A string representation of the class
   */
  _type: string;

  /**
   * Returns back a hash code to identify this specific instance
   *
   * @remarks The combination of class name and Id
   */
  getHashCode: () => string;
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

export type IResult<
  TError extends IError | null = null,
  TData = unknown
> = ICustomUtilityClass & {
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
  error: TError | null;

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
  ABORTED = 5,
}

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

export const enum DateTimeFormatTypes {
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

  "DD-MM-YYYY" = "DD-MM-YYYY",
  "YYYY-DD-MM" = "YYYY-DD-MM",
  "YYYY-MM-DD" = "YYYY-MM-DD",
  "DD-MM-YY" = "DD-MM-YY",
  "YY-DD-MM" = "YY-DD-MM",
  "YY-MM-DD" = "YY-MM-DD",
  "DD-MM-YYYY HH:MM:SS" = "DD-MM-YYYY HH:MM:SS",
  "YYYY-DD-MM HH:MM:SS" = "YYYY-DD-MM HH:MM:SS",
  "YYYY-MM-DD HH:MM:SS" = "YYYY-MM-DD HH:MM:SS",
  "DD-MM-YY HH:MM:SS" = "DD-MM-YY HH:MM:SS",
  "YY-DD-MM HH:MM:SS" = "YY-DD-MM",
  "YY-MM-DD HH:MM:SS" = "YY-MM-DD HH:MM:SS",
  "DD/MM/YYYY" = "DD/MM/YYYY",
  "YYYY/DD/MM" = "YYYY/DD/MM",
  "YYYY/MM/DD" = "YYYY/MM/DD",
  "DD/MM/YY" = "DD/MM/YY",
  "YY/DD/MM" = "YY/DD/MM",
  "YY/MM/DD" = "YY/MM/DD",
  "DD/MM/YYYY HH:MM:SS" = "DD/MM/YYYY HH:MM:SS",
  "YYYY/DD/MM HH:MM:SS" = "YYYY/DD/MM HH:MM:SS",
  "YYYY/MM/DD HH:MM:SS" = "YYYY/MM/DD HH:MM:SS",
  "DD/MM/YY HH:MM:SS" = "DD/MM/YY HH:MM:SS",
  "YY/DD/MM HH:MM:SS" = "YY/DD/MM",
  "YY/MM/DD HH:MM:SS" = "YY/MM/DD HH:MM:SS",
}

/**
 * Wrap the `Temporal.Instant` object so we can re-use it in other places
 */
export interface IDateTime extends Temporal.Instant, ICustomUtilityClass {}

/**
 * Represents an HTTP method.
 */
export enum HttpMethod {
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  CONNECT = "CONNECT",
  OPTIONS = "OPTIONS",
  TRACE = "TRACE",
  PATCH = "PATCH",
}

/**
 * Represents an HTTP file which will be transferred from or to a server.
 */
export type HttpFile = Blob & { readonly name: string };

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

export type LiteralUnion<T extends U, U extends Primitive> =
  | T
  | (U & {
      _?: never;
    });

export type Primitive =
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

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
  csv: ",",
  ssv: " ",
  tsv: "\t",
  pipes: "|",
};

export interface HttpFetchApi {
  signal: AbortSignal;
  abort: (reason?: string) => void;
  dispatch: (action: any) => any;
  getState: () => unknown;
  extra: unknown;
  endpoint: string;
  type: "query" | "mutation";
  /**
   * Only available for queries: indicates if a query has been forced,
   * i.e. it would have been fetched even if there would already be a cache entry
   * (this does not mean that there is already a cache entry though!)
   *
   * This can be used to for example add a `Cache-Control: no-cache` header for
   * invalidated queries.
   */
  forced?: boolean;
}
