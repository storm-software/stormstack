/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseError } from "@open-system/core-shared-utilities";

export const ENV_TOKEN = Symbol.for("ENV_TOKEN");

export interface BaseOptions {
  /**
   * How to determine whether the app is running on the server or the client.
   * @default typeof window === "undefined"
   */
  isServer?: boolean;

  /**
   * Called when an environment variable is missing. By default an error is thrown.
   * @param variable The name of the environment variable that is missing.
   * @returns
   */
  onMissingVariableError?: (variable: string) => any;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   * @param variable The name of the environment variable that is missing.
   * @returns
   */
  onValidationError?: (variable: string, error?: BaseError) => any;

  /**
   * Called when a server-side environment variable is accessed on the client.
   * By default an error is thrown.
   * @param variable The name of the environment variable that is missing.
   * @returns
   */
  onInvalidAccess?: (variable: string) => any;

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
  handler?: (
    prop: string,
    options: Omit<BaseOptions, "env"> & Required<Pick<BaseOptions, "env">>
  ) => Awaited<Promise<any> | any>;

  /**
   * The environment variables to use. Defaults to `process.env`.
   */
  env?: Record<string, string | boolean | number | undefined>;

  /**
   * The prefix to use when accessing environment variables (will try both with and without).
   * If potentially multiple can be used, pass an array of prefixes.
   */
  prefix?: string | string[];
}
