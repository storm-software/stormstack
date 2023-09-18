import chalk from "chalk";
import { formatLog } from "../format";

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
  newLine: boolean | undefined = true,
  newLineAfter: boolean | undefined = true,
  stackTrace: boolean | undefined = false
) => {
  console.info(
    formatLog(
      message,
      newLine,
      newLineAfter,
      chalk.bold.blue("> " + chalk.bgBlue.whiteBright(" i ") + " INFO -"),
      undefined,
      stackTrace
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
  newLine: boolean | undefined = true,
  newLineAfter: boolean | undefined = true,
  stackTrace: boolean | undefined = false
) => {
  console.info(
    formatLog(
      message,
      newLine,
      newLineAfter,
      chalk.bold.green(
        "> " + chalk.bold.bgGreen.whiteBright(" ✓ ") + " SUCCESS -"
      ),
      undefined,
      stackTrace
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
  newLine: boolean | undefined = true,
  newLineAfter: boolean | undefined = true,
  stackTrace: boolean | undefined = true
) => {
  console.warn(
    formatLog(
      message,
      newLine,
      newLineAfter,
      chalk.bold.yellow("> " + chalk.bgYellow.blackBright(" ▲ ") + " WARN -"),
      undefined,
      stackTrace
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
  newLine: boolean | undefined = true,
  newLineAfter: boolean | undefined = true,
  stackTrace: boolean | undefined = true,
  prefix = "ERROR"
) => {
  const error = message as Error;
  console.error(message);
  console.error(
    formatLog(
      error?.message ? error.message : message,
      newLine,
      newLineAfter,
      chalk.bold.red(
        `> ${chalk.bgRed.whiteBright(" ! ")} ${prefix} ${chalk.italic(
          error?.name ? `(${error.name}) ` : ""
        )}-`
      ),
      undefined,
      stackTrace !== false ? error.stack : false
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
export const printFatal = (
  message: unknown[] | Error,
  newLine: boolean | undefined = true,
  newLineAfter: boolean | undefined = true,
  stackTrace: boolean | undefined = true
) => {
  printError(message, newLine, newLineAfter, stackTrace, "FATAL");
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
