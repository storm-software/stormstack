import { ServerConfigManager } from "@open-system/core-server-utilities";
import { Logger } from "@open-system/core-shared-utilities";
import { Injectable } from "graphql-modules";
import pino from "pino";

@Injectable({
  global: true,
})
export class PinoLogger extends Logger {
  #logger: pino.BaseLogger;

  constructor(private readonly config: ServerConfigManager) {
    super();

    this.#logger = pino({
      level: this.config.logging.logLevel || "info",
      formatters: {
        level: label => {
          return { level: label.toUpperCase() };
        },
      },
    });
  }

  /**
   * This function takes a string as an argument, prints it to the console, and returns a promise that
   * resolves to void.
   * @param {string} message - The message to print.
   * @returns Nothing.
   */
  public success(...message: any[]) {
    this.#logger.info(message);
  }

  /**
   * It returns a promise that resolves to void.
   * @param {string} message - The message to be displayed.
   * @returns Nothing.
   */
  public error(...message: any[]) {
    this.#logger.error(message);
  }

  /**
   * It returns a promise that resolves to void.
   * @param {string} error - The message to be displayed.
   * @returns Nothing.
   */
  public exception(...message: any[]) {
    this.#logger.error(message);
  }

  /**
   * The function takes a string as an argument and returns a promise that resolves to void.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public warn(...message: any[]) {
    this.#logger.warn(message);
  }

  /**
   * @param {string} message - The message to be printed.
   * @returns A promise that resolves to void.
   */
  public info(...message: any[]) {
    this.#logger.info(message);
  }

  /**
   * It prints a warning message.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public debug(...message: any[]) {
    this.#logger.debug(message);
  }
}
