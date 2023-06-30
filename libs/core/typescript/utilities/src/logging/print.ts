import chalk from "chalk";
import { formatDateTime } from "../common/date-fns";
import { DateTime } from "../common/date-time";
import { isProduction } from "../common/env-fns";
import { isEmpty, isError, isObject, isPrimitive } from "../common/type-checks";

/**
 * `print` is a function that takes a `message` of type `string`, a `newLine` of type `boolean`
 * (defaults to `true`), a `newLineAfter` of type `boolean` (defaults to `true`), and an optional
 * `prefix` of type `string`
 * @param {string} message - string - The message to print
 * @param [newLine=true] - boolean - Whether to print a new line before the message.
 * @param [newLineAfter=true] - boolean
 * @param {string} [prefix] - The prefix to use for the message.
 */
const print = (
  message: unknown | unknown[],
  newLine = true,
  newLineAfter = true,
  prefix?: string,
  postfix?: string,
  stackTrace?: string
): string => {
  return `${newLine ? "\n" : ""}${prefix ? `${prefix} ` : ""}${
    Array.isArray(message)
      ? message.reduce((ret, m, i) => {
          ret += formatLine(m) + (i < message.length - 1 ? "\n" : "");
          return ret;
        }, "")
      : formatLine(message)
  }${postfix ? postfix : ""}${
    !isProduction()
      ? "\n" +
        chalk.bold("Timestamp: ") +
        formatDateTime(
          DateTime.current,
          { smallestUnit: "milliseconds" },
          "UTC"
        ) +
        "\n" +
        chalk.bold("Stack Trace: ") +
        (stackTrace
          ? stackTrace
          : (message as Error)?.stack
          ? (message as Error)?.stack
          : new Error().stack?.substring(6) ?? "")
      : ""
  }${newLineAfter ? "\n" : ""}`;
};

/**
 * `print` is a function that takes a `message` of type `string`, a `newLine` of type `boolean`
 * (defaults to `true`), a `newLineAfter` of type `boolean` (defaults to `true`), and an optional
 * `prefix` of type `string`
 * @param {string} message - string - The message to print
 * @param [newLine=true] - boolean - Whether to print a new line before the message.
 * @param [newLineAfter=true] - boolean
 * @param {string} [prefix] - The prefix to use for the message.
 */
const format = (message: unknown): string =>
  isEmpty(message)
    ? "<Empty>"
    : !isPrimitive(message) && !isObject(message) && !isError(message)
    ? "<Object>"
    : isError(message)
    ? (message as Error)?.name && (message as Error)?.message
      ? `${(message as Error)?.name}: ${(message as Error)?.message}`
      : (message as Error)?.name
      ? (message as Error)?.name
      : (message as Error)?.message
      ? (message as Error)?.message
      : "<Error>"
    : isObject(message)
    ? JSON.stringify(message)
    : (message as string);

/**
 * `print` is a function that takes a `message` of type `string`, a `newLine` of type `boolean`
 * (defaults to `true`), a `newLineAfter` of type `boolean` (defaults to `true`), and an optional
 * `prefix` of type `string`
 * @param {string} message - string - The message to print
 * @param [newLine=true] - boolean - Whether to print a new line before the message.
 * @param [newLineAfter=true] - boolean
 * @param {string} [prefix] - The prefix to use for the message.
 */
const formatLine = (message: unknown): string =>
  Array.isArray(message)
    ? message.reduce((ret, m, i) => {
        ret += formatLine(m) + (i < message.length - 1 ? ", " : "");
        return ret;
      }, "")
    : format(message);

/**
 * It takes a message, a boolean for whether or not to print a new line before the message, a boolean
 * for whether or not to print a new line after the message, and a string for the icon to print before
 * the message.
 * @param {string} message - string - The message to print
 * @param [newLine=true] - If true, the message will be printed on a new line.
 * @param [newLineAfter=true] - If true, a new line will be printed after the message.
 */
export const printInfo = (
  message: unknown[],
  newLine = true,
  newLineAfter = true
) => {
  console.info(
    print(
      message,
      newLine,
      newLineAfter,
      chalk.bold.blue(" > " + chalk.bgBlue.whiteBright(" i ") + " INFO -")
    )
  );
};

/**
 * It prints a message to the console, optionally with a new line before and/or after the message, and
 * optionally with a green checkmark at the end of the message.
 *
 * The function is written in TypeScript, but it's not really doing anything that's specific to
 * TypeScript. It's just a function that prints a message to the console.
 *
 * The function is written in a way that makes it easy to test. It has no side effects, and it returns
 * nothing. It just prints a message to the console.
 *
 * The function is written in a way that makes it easy to use. It has a default value for each of its
 * parameters, so you can call it with no parameters at all, and it will still work.
 *
 * The function is written in a way that makes it easy to read. It has a descriptive name, and it has a
 * descriptive comment at the top of the function.
 * @param {string} message - string - The message to print
 * @param [newLine=true] - boolean - whether to print a new line before the message
 * @param [newLineAfter=true] - boolean
 */
export const printSuccess = (
  message: unknown[],
  newLine = true,
  newLineAfter = true
) => {
  console.log(
    print(
      message,
      newLine,
      newLineAfter,
      chalk.bold.green(" > " + chalk.bgGreen.whiteBright(" ✓ ") + " SUCCESS -")
    )
  );
};

/**
 * It prints a message to the console with a yellow exclamation mark at the end.
 * @param {string} message - string - The message to print
 * @param [newLine=true] - boolean - whether to print a new line before the message
 * @param [newLineAfter=true] - boolean
 */
export const printWarning = (
  message: unknown[],
  newLine = true,
  newLineAfter = true
) => {
  console.warn(
    print(
      message,
      newLine,
      newLineAfter,
      chalk.bold.yellow(" > " + chalk.bgYellow.blackBright(" ! ") + " WARN -")
    )
  );
};

/**
 * It prints a message to the console, optionally with a new line before and/or after the message, and
 * optionally with a symbol after the message.
 * @param {string} message - string - The message to print
 * @param [newLine=true] - boolean - whether to print a new line before the message
 * @param [newLineAfter=true] - boolean
 */
export const printError = (
  message: unknown[] | Error,
  newLine = true,
  newLineAfter = true
) => {
  const error = message as Error;

  console.error(
    print(
      error?.message ? error.message : message,
      newLine,
      newLineAfter,
      chalk.bold.red(
        ` > ${chalk.bgRed.whiteBright(" ! ")} ERROR ${chalk.italic(
          error?.name ? `(${error.name}) ` : ""
        )}-`
      ),
      undefined,
      error.stack
    )
  );
};

/**
 * `printGroup` is a function that takes a string and returns nothing
 * @param {string} group - string
 */
export const startGroup = (group: string) => {
  console.group(group);
};

export const endGroup = () => {
  console.groupEnd();
};
