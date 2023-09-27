/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Provider } from "@stormstack/core-shared-injection/decorators";
import ora from "ora";
import { formatLog } from "../format";
import { Logger } from "../logger";
import {
  endGroup,
  printError,
  printFatal,
  printInfo,
  printSuccess,
  printWarning,
  startGroup
} from "./print";
import { ConsoleSpinner } from "./types";

@Provider(Logger)
export class ConsoleLogger extends Logger {
  /**
   * It takes a string as an argument and prints it to the console.
   * @param {string} message - The message to be printed.
   */
  static success(...message: any[]) {
    printSuccess(message, true, true, false);
  }

  /**
   * @param {string} message - The fatal message to be printed.
   */
  static fatal(...message: any[]) {
    printFatal(message, true, true, true);
  }

  /**
   * @param {string} message - The message to be printed.
   */
  static error(...message: any[]) {
    printError(message, true, true, true);
  }

  /**
   * @param {string} error - The message to be printed.
   */
  static exception(error: Error) {
    printError(error, true, true, true);
  }

  /**
   * It prints a warning message.
   * @param {string} message - The message to be printed.
   */
  static warn(...message: any[]) {
    printWarning(message, true, true, true);
  }

  /**
   * The function `info` is a static method of the class `Logger`. It takes a string as an argument and
   * calls the function `printInfo` with that string as an argument.
   *
   * The function `printInfo` is defined in the file `logger.js` and is not part of the class `Logger`.
   *
   * The function `printInfo` is defined as follows:
   * @param {string} message - The message to be printed.
   */
  static info(...message: any[]) {
    printInfo(message, true, true, false);
  }

  /**
   * The function `debug` is a static method of the class `Logger`. It takes a string as an argument and
   * calls the function `printInfo` with that string as an argument.
   * @param {string} message - The message to be printed.
   */
  static debug(...message: any[]) {
    printInfo(message, true, true, false);
  }

  /**
   * The function `log` is a static method of the class `Logger`. It takes a string as an argument and
   * calls the function `printInfo` with that string as an argument.
   * @param {string} message - The message to be printed.
   */
  static log(...message: any[]) {
    console.log(formatLog(message, false, false, undefined, undefined, false));
  }

  /**
   * The static showTitle() function calls the showTitle() method of a ConsoleLogger instance.
   */
  static showTitle() {
    const logger = new ConsoleLogger();
    logger.showTitle();
  }

  /**
   * The function `debug` is a static method of the class `Logger`. It takes a string as an argument and
   * calls the function `printInfo` with that string as an argument.
   * @param {string} message - The message to be printed.
   */
  static group(group: string) {
    startGroup(group);
  }

  /**
   * The function "groupEnd" ends a group in TypeScript.
   */
  static groupEnd() {
    endGroup();
  }

  /**
   * The function returns a ConsoleSpinner object, which is created using the ora library and takes an
   * optional text parameter.
   * @param {string} [text] - The `text` parameter is an optional string that represents the text to be
   * displayed alongside the spinner.
   * @returns an instance of the `ConsoleSpinner` class.
   */
  static spinner(text?: string): ConsoleSpinner {
    return ora(text);
  }

  /**
   * The function `spinnerStart` returns a ConsoleSpinner object that starts a spinner animation with an
   * optional text.
   * @param {string} [text] - The `text` parameter is an optional string that represents the text to be
   * displayed alongside the spinner. It is used to provide additional context or information to the user
   * while the spinner is running. If no `text` is provided, the spinner will be displayed without any
   * accompanying text.
   * @returns a ConsoleSpinner object.
   */
  static spinnerStart(text?: string): ConsoleSpinner {
    return ConsoleLogger.spinner(text).start();
  }

  /**
   * The function stops a console spinner and returns the stopped spinner.
   * @param {ConsoleSpinner} spinner - The parameter "spinner" is of type "ConsoleSpinner".
   * @returns the stopped spinner object.
   */
  static spinnerStop(spinner: ConsoleSpinner): ConsoleSpinner {
    return spinner.stop();
  }

  public constructor(_name = "root") {
    super(_name);
  }

  /**
   * This function takes a string as an argument, prints it to the console, and returns a promise that
   * resolves to void.
   * @param {string} message - The message to print.
   * @returns Nothing.
   */
  public success = (...message: any[]) => {
    printSuccess(message, true, true, true);
  };

  /**
   * It returns a promise that resolves to void.
   * @param {string} message - The fatal message to be displayed.
   * @returns Nothing.
   */
  public fatal = (...message: any[]) => {
    printFatal(message, true, true, true);
  };

  /**
   * It returns a promise that resolves to void.
   * @param {string} message - The message to be displayed.
   * @returns Nothing.
   */
  public error = (...message: any[]) => {
    printError(message, true, true, true);
  };

  /**
   * It returns a promise that resolves to void.
   * @param {string} error - The message to be displayed.
   * @returns Nothing.
   */
  public exception = (error: Error) => {
    printError(error, true, true, true);
  };

  /**
   * The function takes a string as an argument and returns a promise that resolves to void.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public warn = (...message: any[]) => {
    printWarning(message, true, true, true);
  };

  /**
   * @param {string} message - The message to be printed.
   * @returns A promise that resolves to void.
   */
  public info = (...message: any[]) => {
    printInfo(message, true, true, false);
  };

  /**
   * It prints a warning message.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public debug = (...message: any[]) => {
    printInfo(message, true, true, true);
  };

  /**
   * It prints a warning message.
   * @param {string} message - The trace message to be printed.
   * @returns Nothing.
   */
  public trace = (...message: any[]) => {
    printInfo(message, true, true, true);
  };

  /**
   * @param {string} message - The message to be printed.
   * @returns A promise that resolves to void.
   */
  public log = (...message: any[]) => {
    console.log(formatLog(message, false, false, undefined, undefined, false));
  };

  /**
   * Returns a logger with the provided bindings attached to its log messages
   * @param bindings Key-value pairs to attach to all messages
   * @returns The new logger instance
   */
  public override withFields = (name: string): ConsoleLogger => {
    return new ConsoleLogger(name);
  };
}
