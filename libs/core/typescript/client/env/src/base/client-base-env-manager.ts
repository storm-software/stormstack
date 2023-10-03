/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DEFAULT_OPTIONS as DEFAULT_SHARED_OPTIONS,
  EnvManager
} from "@stormstack/core-shared-env";
import { Provider } from "@stormstack/core-shared-injection";
import { isPromise } from "@stormstack/core-shared-utilities/common/type-checks";
import { EnvConfigurationError } from "@stormstack/core-shared-utilities/errors/env-configuration-error";
import { ClientBaseEnvManagerOptions } from "../types";

export const DEFAULT_OPTIONS: ClientBaseEnvManagerOptions = {
  ...DEFAULT_SHARED_OPTIONS,
  defaultGateway: "http://localhost:3000"
};

@Provider(EnvManager)
export class ClientBaseEnvManager<
  TOptions extends ClientBaseEnvManagerOptions = ClientBaseEnvManagerOptions
> extends EnvManager<TOptions> {
  constructor(options: ClientBaseEnvManagerOptions = DEFAULT_OPTIONS) {
    super({
      ...DEFAULT_OPTIONS,
      ...options
    } as TOptions);
  }

  public get sentryToken() {
    return this.get("SENTRY_AUTH_TOKEN");
  }

  public get sentryProperties() {
    return this.get("SENTRY_PROPERTIES");
  }

  public get sentryOrganization() {
    return this.get("SENTRY_ORGANIZATION");
  }

  public get gateway() {
    return this.isProduction ? this.baseUrl : this.options.defaultGateway;
  }

  protected innerGet = <T = any>(name: string): T | undefined => {
    const value = this.proxy[name] as T | undefined;
    if (isPromise(value)) {
      throw new EnvConfigurationError(
        name,
        `The environment variable "${name}" is not available synchronously.`
      );
    }
    return value;
  };

  protected override innerGetAsync = async <T = any>(
    name: string
  ): Promise<T | undefined> => {
    return Promise.resolve(this.proxy[name]) as T | undefined;
  };
}
