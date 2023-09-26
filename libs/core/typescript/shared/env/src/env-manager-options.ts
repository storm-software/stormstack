/* eslint-disable @typescript-eslint/no-explicit-any */

import { EnvConfigurationError } from "@stormstack/core-shared-utilities/errors/env-configuration-error";
import { BaseOptions } from "./types";

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
