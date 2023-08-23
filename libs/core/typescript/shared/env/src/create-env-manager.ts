/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  EnvConfigurationError,
  isFunction,
  isPromise,
  noop
} from "@open-system/core-shared-utilities";
import { BaseOptions } from "./types";

const cache = new Map<string | symbol, any>();
let obj!: any;

export const DEFAULT_OPTIONS: BaseOptions = {
  isServer: typeof window === "undefined",
  skipValidation: false,
  onMissingVariableError: (variable: string, error?: any) => {
    throw new EnvConfigurationError(variable, error);
  },
  onValidationError: (variable: string, error?: any) => {
    throw new EnvConfigurationError(variable, error);
  },
  onInvalidAccess: (variable: string) => {
    throw new EnvConfigurationError(
      variable,
      `Tried to access environment variable "${variable}" on the client.`
    );
  },
  env: process.env
};

export const getEnvironmentVariable = async <
  TOptions extends Omit<BaseOptions, "env"> &
    Required<Pick<BaseOptions, "env">> = Omit<BaseOptions, "env"> &
    Required<Pick<BaseOptions, "env">>
>(
  prop: string,
  options: TOptions
) => {
  let value: any = options.env[prop as string];
  if (!value) {
    if (cache.has(prop as string)) {
      value = cache.get(prop as string);
    }

    if (!value && isFunction(options.handler)) {
      value = options.handler(prop as string);
      if (isPromise(value)) {
        value = await value;
      }

      cache.set(prop as string, value);
    }
  }

  if (!value) {
    // Handle missing variable
    const onMissingVariableError =
      options.onMissingVariableError ?? DEFAULT_OPTIONS.onMissingVariableError;
    onMissingVariableError && onMissingVariableError(prop as string);
  }

  return value;
};

/**
 * Creates an environment manager that can be used to access environment variables.
 * @param options The options to use when accessing the environment variables.
 * @returns The environment variable manager.
 */
export const createEnvManager = <
  TManager = Record<string, string | boolean | number | undefined>,
  TOptions extends BaseOptions = BaseOptions
>(
  options: TOptions = DEFAULT_OPTIONS as TOptions
): TManager => {
  if (!obj) {
    const env = options?.env ?? DEFAULT_OPTIONS.env ?? {};
    obj = new Proxy(env, {
      get: async (
        target: Record<string, string | boolean | number | undefined>,
        prop: string
      ) => {
        let value = await getEnvironmentVariable<
          TOptions & { env: typeof env }
        >(prop as string, {
          ...options,
          env: target,
          onMissingVariableError: noop
        });

        if (!value) {
          let prefix = options.prefix ?? DEFAULT_OPTIONS.prefix;
          if (prefix && !Array.isArray(prefix)) {
            prefix = [prefix];
          }

          if (prefix) {
            for (const p of prefix) {
              value = await getEnvironmentVariable<
                TOptions & { env: typeof env }
              >(`${p}${prop}`, {
                ...options,
                env: target,
                onMissingVariableError: noop
              });

              if (value) {
                return value;
              }
            }
          }

          if (!value && !options.skipValidation) {
            const onMissingVariableError =
              options.onMissingVariableError ??
              DEFAULT_OPTIONS.onMissingVariableError;

            onMissingVariableError && onMissingVariableError(prop as string);
          }
        }

        return value;
      }
    });
  }

  return obj;
};
