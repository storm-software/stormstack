import { JsonParser } from "@stormstack/core-shared-serialization";
import {
  BaseError,
  DateTime,
  NEWLINE_STRING,
  formatDateTime,
  isBaseType,
  isEmpty,
  isError,
  isObject,
  isProduction,
  isString
} from "@stormstack/core-shared-utilities";

/**
 * `formatLog` is a function that takes a `message` of type `string`, a `newLine` of type `boolean`
 * (defaults to `true`), a `newLineAfter` of type `boolean` (defaults to `true`), and an optional
 * `prefix` of type `string`
 * @param {string} message - string - The message to print
 * @param [newLine=true] - boolean - Whether to print a new line before the message.
 * @param [newLineAfter=true] - boolean
 * @param {string} [prefix] - The prefix to use for the message.
 */
export const formatLog = (
  message: unknown | unknown[],
  newLine = true,
  newLineAfter = true,
  prefix?: string,
  postfix?: string,
  stackTrace: string | boolean | undefined = false
): string => {
  return `${newLine ? NEWLINE_STRING : ""}${prefix ? `${prefix} ` : ""}${
    Array.isArray(message)
      ? message.reduce((ret, m, i) => {
          ret +=
            formatLogLine(m) + (i < message.length - 1 ? NEWLINE_STRING : "");
          return ret;
        }, "")
      : formatLogLine(message)
  }${postfix ? postfix : ""}${
    !isProduction()
      ? NEWLINE_STRING +
        "Timestamp: " +
        formatDateTime(
          DateTime.current,
          { smallestUnit: "milliseconds", calendarName: "never" },
          "UTC"
        ) +
        (stackTrace !== false
          ? NEWLINE_STRING +
            `Stack Trace: ${NEWLINE_STRING}` +
            (typeof stackTrace === "string"
              ? stackTrace
              : (message as Error)?.stack
              ? (message as Error)?.stack
              : new Error().stack?.substring(6) ?? "")
          : "")
      : ""
  }${newLineAfter ? NEWLINE_STRING : ""}`;
};

/**
 * `formatLogLine` is a function that takes a `message` of type `string`, a `newLine` of type `boolean`
 * (defaults to `true`), a `newLineAfter` of type `boolean` (defaults to `true`), and an optional
 * `prefix` of type `string`
 * @param {string} message - string - The message to print
 * @param [newLine=true] - boolean - Whether to print a new line before the message.
 * @param [newLineAfter=true] - boolean
 * @param {string} [prefix] - The prefix to use for the message.
 */
const formatLogLine = (message: unknown): string =>
  Array.isArray(message)
    ? message.reduce((ret, m, i) => {
        ret += formatLogLine(m) + (i < message.length - 1 ? ", " : "");
        return ret;
      }, "")
    : isEmpty(message)
    ? "<Empty>"
    : !isBaseType(message) && !isObject(message) && !isError(message)
    ? JsonParser.stringify(message)
    : isError(message)
    ? (message as Error)?.name && (message as Error)?.message
      ? `${(message as Error)?.name}: ${(message as Error)?.message}`
      : (message as Error)?.name
      ? (message as Error)?.name
      : (message as Error)?.message
      ? (message as Error)?.message
      : "<Error>"
    : !isString(message)
    ? JsonParser.stringify(message)
    : (message as string);

/**
 * `formatErrorLog` is a function that takes a `message` of type `string`, a `newLine` of type `boolean`
 * (defaults to `true`), a `newLineAfter` of type `boolean` (defaults to `true`), and an optional
 * `prefix` of type `string`
 * @param {string} message - string - The message to print
 * @param [newLine=true] - boolean - Whether to print a new line before the message.
 * @param [newLineAfter=true] - boolean
 * @param {string} [prefix] - The prefix to use for the message.
 */
export const formatErrorLog = (
  error: Error,
  newLine = true,
  newLineAfter = true,
  prefix?: string,
  postfix?: string
): string => {
  return formatLog(
    BaseError.isBaseError(error)
      ? BaseError.stringify(error)
      : `${error.name}: ${error.message}`,
    newLine,
    newLineAfter,
    prefix,
    postfix,
    error.stack ?? true
  );
};
