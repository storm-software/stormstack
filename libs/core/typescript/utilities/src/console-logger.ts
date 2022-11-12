import { ILogger } from "../@types";
import { printError, printInfo, printSuccess, printWarning } from "./print";

export class ConsoleLogger implements ILogger {
  /**
   * It takes a string as an argument and prints it to the console.
   * @param {string} message - The message to be printed.
   */
  static success(message: string) {
    printSuccess(message);
  }

  /**
   * Static error(message: string) {
   *     printError(message);
   *   }
   * @param {string} message - The message to be printed.
   */
  static error(message: string) {
    printError(message);
  }

  /**
   * It prints a warning message.
   * @param {string} message - The message to be printed.
   */
  static warn(message: string) {
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
  static info(message: string) {
    printInfo(message);
  }

  /**
   * The function `debug` is a static method of the class `Logger`. It takes a string as an argument and
   * calls the function `printInfo` with that string as an argument.
   * @param {string} message - The message to be printed.
   */
  static debug(message: string) {
    printInfo(message);
  }

  /**
   * This function takes a string as an argument, prints it to the console, and returns a promise that
   * resolves to void.
   * @param {string} message - The message to print.
   * @returns Nothing.
   */
  success(message: string): Promise<void> {
    printSuccess(message);
    return;
  }

  /**
   * It returns a promise that resolves to void.
   * @param {string} message - The message to be displayed.
   * @returns Nothing.
   */
  error(message: string): Promise<void> {
    printError(message);
    return;
  }

  /**
   * The function takes a string as an argument and returns a promise that resolves to void.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  warn(message: string): Promise<void> {
    printWarning(message);
    return;
  }

  /**
   * Info(message: string): Promise<void> {
   *     printInfo(message);
   *     return;
   *   }
   * @param {string} message - The message to be printed.
   * @returns A promise that resolves to void.
   */
  info(message: string): Promise<void> {
    printInfo(message);
    return;
  }

  /**
   * It prints a warning message.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  debug(message: string): Promise<void> {
    printInfo(message);
    return;
  }
}
