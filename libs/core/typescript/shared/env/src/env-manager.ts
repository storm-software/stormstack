/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BaseUtilityClass,
  EMPTY_STRING,
  isNotEmpty,
  parseInteger
} from "@stormstack/core-shared-utilities";
import { createEnvProxy } from "./create-env-proxy";
import { DEFAULT_OPTIONS } from "./env-manager-options";
import { BaseOptions, ENV_TOKEN, EnvProxy, EnvironmentType } from "./types";

export abstract class EnvManager<
  TOptions extends BaseOptions = BaseOptions
> extends BaseUtilityClass {
  protected proxy: EnvProxy;

  public get defaultLocale(): string {
    return this.getWithDefault<string>("DEFAULT_LOCALE", "en-US");
  }

  public get defaultTimezone(): string {
    return this.getWithDefault<string>("DEFAULT_TIMEZONE", "America/New_York");
  }

  public get environment(): EnvironmentType {
    const _environment = this.get<EnvironmentType>("NODE_ENV");
    /*if (isEmpty(_environment)) {
      this.logger?.error("Environment variable NODE_ENV is not defined.");
    }*/

    // Default to production since the rules are stricter.
    return (
      _environment ??
      this.get<EnvironmentType>("ENVIRONMENT") ??
      EnvironmentType.PRODUCTION
    );
  }

  public get isDevelopment(): boolean {
    return (
      this.environment === EnvironmentType.DEVELOPMENT ||
      !isNotEmpty(this.get("GITPOD_WORKSPACE_ID"))
    );
  }

  public get isStaging(): boolean {
    return !this.isDevelopment && this.environment === EnvironmentType.STAGING;
  }

  public get isProduction(): boolean {
    return (
      !this.isDevelopment && this.environment === EnvironmentType.PRODUCTION
    );
  }

  public get baseUrl(): URL {
    let url = this.get<string>("BASE_URL");
    if (!url || this.isDevelopment) {
      if (!this.isDevelopment) {
        console.warn("BASE_URL is not defined. Defaulting to localhost.");
      }

      url = "http://localhost:3000";
    }

    return new URL(url);
  }

  public get isCI(): boolean {
    return !!this.getWithDefault<boolean>("CI", false);
  }

  public get repositoryOwner(): string {
    return this.getWithDefault<string>("CI_REPO_OWNER", "sullivanpj");
  }

  public get repositoryWorker(): string {
    return this.getWithDefault<string>("CI_REPO_WORKER", "🤖 Storm Bot");
  }

  public get repositoryName(): string {
    return this.getWithDefault<string>("CI_REPO_NAME", "stormstack");
  }

  public get repositoryUrl(): URL {
    const url = this.getWithDefault<string>(
      "CI_REPO_URL",
      "https://github.com/stormstack/stormstack"
    );

    return new URL(url);
  }

  public get branchName(): string {
    return this.getWithDefault<string>("CI_BRANCH", "main");
  }

  public get serviceId(): string {
    return this.getWithDefault<string>("SERVICE_ID", EMPTY_STRING);
  }

  public get serviceName(): string {
    return this.getWithDefault<string>("SERVICE_NAME", EMPTY_STRING);
  }

  public get serviceUrl(): URL | undefined {
    const url = this.get<string>("SERVICE_URL");

    return isNotEmpty(url) ? new URL(url) : this.baseUrl;
  }

  public get serviceVersion(): string {
    return this.getWithDefault<string>("SERVICE_VERSION", "0.0.1");
  }

  public get domainName(): string {
    return this.getWithDefault<string>("DOMAIN_NAME", "core");
  }

  public get defaultQuerySize(): number {
    return parseInteger(
      this.getWithDefault<number>("DEFAULT_QUERY_SIZE", 100),
      100
    );
  }

  public get sdkVersion(): string {
    return this.getWithDefault<string>("STORM_SDK_VERSION", "0.0.1");
  }

  public get tenantId() {
    return this.get("X_TENANT_ID");
  }

  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public get __base(): string {
    return "EnvManager";
  }

  constructor(public readonly options = DEFAULT_OPTIONS as TOptions) {
    super(ENV_TOKEN);

    this.proxy = createEnvProxy({ ...DEFAULT_OPTIONS, ...this.options });
  }

  public get = <T = any>(name: string): T | undefined => {
    // this.logger?.debug(`Getting environment variable "${name}".`);

    return this.innerGet<T>(name);
  };

  public getWithDefault<T = any>(name: string, defaultValue: T): T;
  public getWithDefault<T = any>(
    name: string,
    defaultValue: undefined
  ): T | undefined {
    //this.logger?.debug(`Getting environment variable "${name}".`);

    const value = this.get<T>(name);
    if (isNotEmpty(value)) {
      return defaultValue ?? undefined;
    }

    return value;
  }

  public getAsync = <T = any>(name: string): Promise<T | undefined> => {
    /*this.logger?.debug(
        `Getting external environment variable/secret "${name}".`
      );*/

    return this.innerGetAsync<T>(name);
  };

  public set = <T extends string | boolean | number | undefined = any>(
    name: string,
    value: T
  ) => {
    /*this.logger?.debug(
        `Updating environment variable "${name}" to "${value}".`
      );*/
    this.proxy[name] = value;
  };

  protected abstract innerGet: <T = any>(name: string) => T | undefined;

  protected abstract innerGetAsync: <T = any>(
    name: string
  ) => Promise<T | undefined>;
}
