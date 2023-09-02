/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Logger } from "./logger";
import {
  endGroup,
  print,
  printError,
  printInfo,
  printSuccess,
  printWarning,
  startGroup
} from "./print";

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
    printError(message, true, true, true);
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
    print(message, false, false, undefined, undefined, false);
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

  static groupEnd() {
    endGroup();
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
    printError(message, true, true, true);
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
    print(message, false, false, undefined, undefined, false);
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
