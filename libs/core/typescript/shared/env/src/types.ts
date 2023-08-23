import { ZodError } from "zod";

export const CONFIG_TOKEN = Symbol.for("CONFIG_TOKEN");

export interface BaseOptions {
  /**
   * How to determine whether the app is running on the server or the client.
   * @default typeof window === "undefined"
   */
  isServer?: boolean;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   */
  onValidationError?: (error: ZodError) => never;

  /**
   * Called when a server-side environment variable is accessed on the client.
   * By default an error is thrown.
   */
  onInvalidAccess?: (variable: string) => never;

  /**
   * Whether to skip validation of environment variables.
   * @default false
   */
  skipValidation?: boolean;

  /**
   * Handler for when an environment variable is accessed and does not exist
   * in the environment.
   * @param prop The name of the environment variable that was accessed.
   * @returns The value of the environment variable.
   */
  handler?: (prop: string | symbol) => Awaited<Promise<any> | any>;

  /**
   * The environment variables to use. Defaults to `process.env`.
   */
  env?: Record<string, string | undefined>;
}
