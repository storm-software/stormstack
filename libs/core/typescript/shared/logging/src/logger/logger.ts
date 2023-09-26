/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from "@stormstack/core-shared-injection/decorators";
import { BaseUtilityClass } from "@stormstack/core-shared-utilities/common";
import chalk from "chalk";
import { LOGGER_SYMBOL } from "../types";

@Provider()
export abstract class Logger extends BaseUtilityClass {
  public get name(): string {
    return this._name;
  }

  constructor(protected _name = "root") {
    super(LOGGER_SYMBOL);
  }

  /**
   * This function takes a string as an argument, prints it to the console, and returns a promise that
   * resolves to void.
   * @param {string} message - The message to print.
   * @returns Nothing.
   */
  public abstract success: (...message: any[]) => any;

  /**
   * It returns a promise that resolves to void.
   * @param {string} message - The fatal message to be displayed.
   * @returns Nothing.
   */
  public abstract fatal: (...message: any[]) => any;

  /**
   * It returns a promise that resolves to void.
   * @param {string} message - The message to be displayed.
   * @returns Nothing.
   */
  public abstract error: (...message: any[]) => any;

  /**
   * It returns a promise that resolves to void.
   * @param {string} error - The message to be displayed.
   * @returns Nothing.
   */
  public abstract exception: (...message: any[]) => any;

  /**
   * The function takes a string as an argument and returns a promise that resolves to void.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public abstract warn: (...message: any[]) => any;

  /**
   * @param {string} message - The message to be printed.
   * @returns A promise that resolves to void.
   */
  public abstract info: (...message: any[]) => any;

  /**
   * It prints a debug message.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public abstract debug: (...message: any[]) => any;

  /**
   * It prints a trace message.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public abstract trace: (...message: any[]) => any;

  /**
   * It prints a warning message.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public abstract log: (...message: any[]) => any;

  /**
   * Returns a logger with the provided bindings attached to its log messages
   * @param bindings Key-value pairs to attach to all messages
   * @returns The new logger instance
   */
  public abstract withFields: (name: string) => Logger;

  /**
   * The function `showTitle()` prints a stylized title using the chalk library in TypeScript.
   */
  public showTitle = (): any => {
    console.log(
      chalk.bgHex("#10B981").bold("                                  ")
    );
    console.log(
      chalk.bgHex("#10B981").bold("  ") +
        chalk.bold("                              ") +
        chalk.bgHex("#10B981").bold("  ")
    );
    console.log(
      chalk.bgHex("#10B981").bold("  ") +
        chalk.bold("  ") +
        chalk.bgHex("#10B981").bold("              ") +
        chalk.bold("            ") +
        chalk.bold("  ") +
        chalk.bgHex("#10B981").bold("  ")
    );
    console.log(
      chalk.bgHex("#10B981").bold("  ") +
        chalk.bold("  ") +
        chalk.bgHex("#10B981").hex("#FFFFFF").bold("     Open     ") +
        chalk.hex("#10B981").bold("    System  ") +
        chalk.bold("  ") +
        chalk.bgHex("#10B981").bold("  ")
    );
    console.log(
      chalk.bgHex("#10B981").bold("  ") +
        chalk.bold("  ") +
        chalk.bgHex("#10B981").bold("              ") +
        chalk.bold("            ") +
        chalk.bold("  ") +
        chalk.bgHex("#10B981").bold("  ")
    );
    console.log(
      chalk.bgHex("#10B981").bold("  ") +
        chalk.bold("                              ") +
        chalk.bgHex("#10B981").bold("  ")
    );
    console.log(
      chalk.bgHex("#10B981").bold("                                  ")
    );
  };
}
