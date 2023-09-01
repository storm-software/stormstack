/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DEFAULT_OPTIONS as DEFAULT_SHARED_OPTIONS,
  EnvManager
} from "@open-system/core-shared-env";
import { BaseOptions } from "@open-system/core-shared-env/types";
import { Service } from "@open-system/core-shared-injection";
import { isPromise } from "@open-system/core-shared-utilities";
import { EnvConfigurationError } from "@open-system/core-shared-utilities/errors/env-configuration-error";
import { getInfisicalClient } from "./infisical-client";

export const DEFAULT_OPTIONS = {
  ...DEFAULT_SHARED_OPTIONS,
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
};

@Service(EnvManager)
export class InfisicalEnvManager<
  TOptions extends Omit<BaseOptions, "env"> &
    Required<Pick<BaseOptions, "env">> = Omit<BaseOptions, "env"> &
    Required<Pick<BaseOptions, "env">>
> extends EnvManager {
  constructor(options: TOptions) {
    super({ ...DEFAULT_OPTIONS, ...options });
  }

  public override get = <T = any>(name: string): T | undefined => {
    const value = this.proxy[name] as T | undefined;
    if (isPromise(value)) {
      throw new EnvConfigurationError(
        name,
        `The environment variable "${name}" is not available synchronously.`
      );
    }
    return value;
  };

  public override getAsync = async <T = any>(
    name: string
  ): Promise<T | undefined> => {
    const value = this.proxy[name] as T | undefined;
    if (isPromise(value)) {
      return await value;
    }

    return value;
  };
}
