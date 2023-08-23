/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseOptions,
  createEnvManager,
  DEFAULT_OPTIONS,
  ENV_TOKEN
} from "@open-system/core-shared-env";
import { Injector } from "@open-system/core-shared-injection";
import { EnvConfigurationError } from "@open-system/core-shared-utilities/errors/env-configuration-error";
import { getInfisicalClient } from "./infisical-client";

export const InfisicalEnvManager = createEnvManager({
  ...DEFAULT_OPTIONS,
  isServer: true,
  handler: async (
    prop: string,
    options: Omit<BaseOptions, "env"> & Required<Pick<BaseOptions, "env">>
  ) => {
    const { INFISICAL_TOKEN, INFISICAL_ENVIRONMENT } = options.env;
    if (!INFISICAL_TOKEN || typeof INFISICAL_TOKEN !== "string") {
      throw new EnvConfigurationError(
        "INFISICAL_TOKEN",
        `The environment variable "INFISICAL_TOKEN" is required to connect to the Infisical system.`
      );
    }

    return await getInfisicalClient(INFISICAL_TOKEN).getSecret(prop, {
      environment: INFISICAL_ENVIRONMENT as string,
      path: "/",
      type: "shared"
    });
  }
});

Injector.bind(ENV_TOKEN).toConstantValue(InfisicalEnvManager);
