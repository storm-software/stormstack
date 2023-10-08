/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DEFAULT_OPTIONS as DEFAULT_SHARED_OPTIONS,
  EnvManager
} from "@stormstack/core-shared-env";
import { Provider } from "@stormstack/core-shared-injection";
import {
  EnvConfigurationError,
  isPromise,
  parseBoolean,
  parseInteger
} from "@stormstack/core-shared-utilities";
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

  public get requestTimeoutMs(): number {
    const threshold = parseInteger(this.get("REQUEST_ERROR_THRESHOLD_MS"));
    return threshold > 0
      ? threshold
      : parseInteger(this.getWithDefault("REQUEST_TIMEOUT_MS", 10000));
  }

  public get requestWarningMs(): number {
    const threshold = parseInteger(this.get("REQUEST_WARN_THRESHOLD_MS"));
    return threshold > 0
      ? threshold
      : parseInteger(this.getWithDefault("REQUEST_WARNING_MS", 5000));
  }

  public get csrfEnabled(): boolean {
    return parseBoolean(this.get("CSRF_ENABLED"));
  }

  public get shouldUseSSE(): boolean {
    return parseBoolean(this.getWithDefault("SHOULD_USE_SSE", true));
  }

  public get loginUrl() {
    return this.get("LOGIN_URL");
  }

  public get logoutUrl() {
    return this.get("LOGOUT_URL");
  }

  public get responseCacheMaxSize(): number {
    return parseInteger(this.getWithDefault("RESPONSE_CACHE_MAX_SIZE", 1000));
  }

  public get responseCacheTtlMs(): number {
    return parseInteger(this.getWithDefault("RESPONSE_CACHE_TTL_MS", 5000));
  }

  protected override innerGet = <T = any>(name: string): T | undefined => {
    const value = this.proxy[name] as T | undefined;
    if (isPromise(value)) {
      throw new EnvConfigurationError(
        name,
        `The environment variable "${name}" is not available synchronously.`
      );
    }

    return value;
  };

  protected override innerGetAsync = <T = any>(
    name: string
  ): Promise<T | undefined> => {
    return Promise.resolve(this.proxy[name]) as Promise<T | undefined>;
  };
}
