/* eslint-disable @typescript-eslint/no-empty-function */
import { Logger } from "./logger";
import {
  endGroup,
  printError,
  printInfo,
  printSuccess,
  printWarning,
  startGroup,
} from "./print";

export class ConsoleLogger extends Logger {
  /**
   * It takes a string as an argument and prints it to the console.
   * @param {string} message - The message to be printed.
   */
  static success(...message: any[]) {
    printSuccess(message);
  }

  /**
   * @param {string} message - The message to be printed.
   */
  static error(...message: any[]) {
    printError(message);
  }

  /**
   * @param {string} error - The message to be printed.
   */
  static exception(error: Error) {
    printError(error);
  }

  /**
   * It prints a warning message.
   * @param {string} message - The message to be printed.
   */
  static warn(...message: any[]) {
    printWarning(message);
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
    printInfo(message);
  }

  /**
   * The function `debug` is a static method of the class `Logger`. It takes a string as an argument and
   * calls the function `printInfo` with that string as an argument.
   * @param {string} message - The message to be printed.
   */
  static debug(...message: any[]) {
    printInfo(message);
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

  /**
   * This function takes a string as an argument, prints it to the console, and returns a promise that
   * resolves to void.
   * @param {string} message - The message to print.
   * @returns Nothing.
   */
  success(...message: any[]) {
    printSuccess(message);
  }

  /**
   * It returns a promise that resolves to void.
   * @param {string} message - The message to be displayed.
   * @returns Nothing.
   */
  error(...message: any[]) {
    printError(message);
  }

  /**
   * It returns a promise that resolves to void.
   * @param {string} error - The message to be displayed.
   * @returns Nothing.
   */
  exception(error: Error) {
    printError(error);
  }

  /**
   * The function takes a string as an argument and returns a promise that resolves to void.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  warn(...message: any[]) {
    printWarning(message);
  }

  /**
   * @param {string} message - The message to be printed.
   * @returns A promise that resolves to void.
   */
  info(...message: any[]) {
    printInfo(message);
  }

  /**
   * It prints a warning message.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  debug(...message: any[]) {
    printInfo(message);
  }
}
