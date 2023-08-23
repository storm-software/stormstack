/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFunction, isPromise } from "@open-system/core-shared-utilities";
import { BaseOptions } from "./types";

const cache = new Map<string | symbol, any>();
let obj!: any;

const defaultOptions: BaseOptions = {
  isServer: typeof window === "undefined",
  skipValidation: false,
  onValidationError: (error: any) => {
    throw error;
  },
  onInvalidAccess: (variable: string) => {
    throw new Error(
      `Tried to access environment variable "${variable}" on the client.`
    );
  },
  env: process.env
};

/**
 * Creates an environment manager that can be used to access environment variables.
 * @param options The options to use when accessing the environment variables.
 * @returns The environment variable manager.
 */
export const createEnvManager = <
  T = Record<string, string | boolean | number | undefined>
>(
  options: BaseOptions = defaultOptions
): T => {
  if (!obj) {
    obj = new Proxy(options?.env ?? defaultOptions.env ?? {}, {
      get: async (target, prop) => {
        let value: any;
        if (cache.has(prop as string)) {
          value = cache.get(prop as string);
        }

        if (!value && isFunction(options.handler)) {
          value = options.handler(prop as string);
          if (isPromise(value)) {
            value = await value;
          }

          target[prop as string] = value;
          cache.set(prop as string, value);
        }

        return value;
      }
    });
  }

  return obj;
};
