/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvManager } from "@stormstack/core-shared-env/env-manager";
import { Injected, Provider } from "@stormstack/core-shared-injection";
import { Logger } from "@stormstack/core-shared-logging";
import { titleCase } from "@stormstack/core-shared-utilities/common";
import pino from "pino";
import { createFileTransport } from "../transports/file-transport";

@Provider(Logger)
export class PinoLogger extends Logger {
  #logger: pino.BaseLogger;

  constructor(
    @Injected(EnvManager) private readonly env: EnvManager,
    _name = "root"
  ) {
    super(_name);

    this.#logger = pino(
      {
        level:
          this.env.get("LOG_LEVEL") || this.env.get("PINO_LOG_LEVEL") || "info",
        formatters: {
          level: label => {
            return { level: titleCase(label) };
          }
        },
        errorKey: "error",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            colorizeObjects: true,
            errorLikeObjectKeys: ["err", "error", "exception"],
            messageKey: "msg",
            messageFormat:
              "[{time}] {levelLabel} ({if pid}{pid} - {end}{req.url}): {msg}",
            singleLine: false,
            hideObject: false
          }
        }
      },
      createFileTransport(env)
    );
    this.#logger.debug(`Logging has been initialized - ${_name}`);
  }

  /**
   * This function takes a string as an argument, prints it to the console, and returns a promise that
   * resolves to void.
   * @param {string} message - The message to print.
   * @returns Nothing.
   */
  public override success = (...message: any[]) => {
    this.#logger.info(message);
  };

  /**
   * It returns a promise that resolves to void.
   * @param {string} message - The fatal message to be displayed.
   * @returns Nothing.
   */
  public override fatal = (...message: any[]) => {
    this.#logger.error(message);
  };

  /**
   * It returns a promise that resolves to void.
   * @param {string} message - The message to be displayed.
   * @returns Nothing.
   */
  public override error = (...message: any[]) => {
    this.#logger.error(message);
  };

  /**
   * It returns a promise that resolves to void.
   * @param {string} error - The message to be displayed.
   * @returns Nothing.
   */
  public override exception = (...message: any[]) => {
    this.#logger.error(message);
  };

  /**
   * The function takes a string as an argument and returns a promise that resolves to void.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public override warn = (...message: any[]) => {
    this.#logger.warn(message);
  };

  /**
   * @param {string} message - The message to be printed.
   * @returns A promise that resolves to void.
   */
  public override info = (...message: any[]) => {
    this.#logger.info(message);
  };

  /**
   * It prints a warning message.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public override debug = (...message: any[]) => {
    this.#logger.debug(message);
  };

  /**
   * It returns a promise that resolves to void.
   * @param {string} message - The trace message to be displayed.
   * @returns Nothing.
   */
  public override trace = (...message: any[]) => {
    this.#logger.debug(message);
  };

  /**
   * @param {string} message - The message to be printed.
   * @returns A promise that resolves to void.
   */
  public override log = (...message: any[]) => {
    this.#logger.info(message);
  };

  /**
   * It prints a message.
   * @param {string} message - The message to be printed.
   * @returns Nothing.
   */
  public override withFields = (name: string) => {
    return new PinoLogger(this.env, name);
  };
}
