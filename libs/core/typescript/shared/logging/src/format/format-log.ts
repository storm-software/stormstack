import { JsonParser } from "@stormstack/core-shared-serialization";
import {
  BaseError,
  DateTime,
  EMPTY_STRING,
  NEWLINE_STRING,
  StormError,
  formatDateTime,
  isBaseType,
  isEmpty,
  isError,
  isObject,
  isProduction,
  isString
} from "@stormstack/core-shared-utilities";

export type FormatLogOptions = {
  newLine?: boolean;
  newLineAfter?: boolean;
  prefix?: string;
  postfix?: string;
  stackTrace?: string | boolean;
  timestamp?: string | boolean;
};

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
  options: FormatLogOptions = {
    newLine: true,
    newLineAfter: true,
    stackTrace: false
  }
): string => {
  return `${options.newLine ? NEWLINE_STRING : ""}${
    (!isProduction() && options.timestamp !== false) || options.timestamp
      ? (isString(options.timestamp)
          ? options.timestamp
          : "Timestamp: " + formatTimestamp()) + NEWLINE_STRING
      : EMPTY_STRING
  }${options.prefix ? `${options.prefix} ` : EMPTY_STRING}${
    Array.isArray(message)
      ? message.reduce((ret, m, i) => {
          ret +=
            formatLogLine(m) + (i < message.length - 1 ? NEWLINE_STRING : "");
          return ret;
        }, EMPTY_STRING)
      : formatLogLine(message)
  }${options.postfix ? options.postfix : EMPTY_STRING}${
    options.stackTrace !== false && (!isProduction() || options.stackTrace)
      ? isString(options.stackTrace) && options.stackTrace
        ? options.stackTrace
        : formatStacktrace(options.stackTrace, message as BaseError)
      : EMPTY_STRING
  }${options.newLineAfter ? NEWLINE_STRING : EMPTY_STRING}`;
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
        ret +=
          formatLogLine(m) + (i < message.length - 1 ? ", " : EMPTY_STRING);
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
    StormError.isStormError(error)
      ? StormError.stringify(error)
      : `${error.name}: ${error.message}`,
    { newLine, newLineAfter, prefix, postfix, stackTrace: error.stack ?? true }
  );
};

export const formatTimestamp = (
  dateTime: DateTime = DateTime.current
): string => {
  return formatDateTime(
    dateTime,
    { smallestUnit: "milliseconds", calendarName: "never" },
    "UTC"
  );
};

export const formatStacktrace = (
  stackTrace?: string | boolean,
  error?: Error
): string => {
  const stack =
    stackTrace === false
      ? EMPTY_STRING
      : isString(stackTrace) && stackTrace
      ? stackTrace
      : isError(error) && (error as Error)?.stack
      ? (error as Error)?.stack
      : new Error().stack?.substring(6)
      ? new Error().stack?.substring(6)
      : EMPTY_STRING;

  return stack
    ? `Stack Trace: ${NEWLINE_STRING}
${stack}`
    : EMPTY_STRING;
};
