/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  isFunction,
  isPromise,
  noop
} from "@open-system/core-shared-utilities";
import { DEFAULT_OPTIONS } from "./env-manager-options";
import { BaseOptions, EnvProxy } from "./types";

const EnvCache = new Map<string | symbol, any>();
let obj!: any;

export const getEnvironmentVariable = async <
  TOptions extends Omit<BaseOptions, "env"> &
    Required<Pick<BaseOptions, "env">> = Omit<BaseOptions, "env"> &
    Required<Pick<BaseOptions, "env">>
>(
  prop: string,
  options: TOptions
) => {
  const cache = options?.cache ?? EnvCache;

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
 * Creates an environment proxy that can be used to access environment variables.
 * @param options The options to use when accessing the environment variables.
 * @returns The environment variable manager.
 */
export const createEnvProxy = <TOptions extends BaseOptions = BaseOptions>(
  options: TOptions = DEFAULT_OPTIONS as TOptions
): EnvProxy => {
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
