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

  public get defaultLocale() {
    return this.getWithDefault<string>("DEFAULT_LOCALE", "en-US");
  }

  public get defaultTimezone() {
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

  public get baseUrl() {
    return this.isDevelopment
      ? "http://localhost:3000"
      : this.getWithDefault<string>("BASE_URL", EMPTY_STRING);
  }

  public get isCI(): boolean {
    return !!this.getWithDefault<boolean>("CI", false);
  }

  public get repositoryOwner() {
    return this.getWithDefault<string>("CI_REPO_OWNER", "sullivanpj");
  }

  public get repositoryWorker(): string {
    return this.getWithDefault<string>("CI_REPO_WORKER", "🤖 Storm Bot");
  }

  public get repositoryName(): string {
    return this.getWithDefault<string>("CI_REPO_NAME", "stormstack");
  }

  public get repositoryUrl(): string {
    return this.getWithDefault<string>(
      "CI_REPO_URL",
      "https://github.com/stormstack/stormstack"
    );
  }

  public get branchName(): string {
    return this.getWithDefault<string>("CI_BRANCH", "main");
  }

  public get serviceId() {
    return this.getWithDefault<string>("SERVICE_ID", EMPTY_STRING);
  }

  public get serviceName() {
    return this.getWithDefault<string>("SERVICE_NAME", EMPTY_STRING);
  }

  public get serviceUrl() {
    return this.getWithDefault<string>("SERVICE_URL", EMPTY_STRING);
  }

  public get serviceVersion() {
    return this.getWithDefault<string>("SERVICE_VERSION", "0.0.1");
  }

  public get domainName() {
    return this.getWithDefault<string>("DOMAIN_NAME", "core");
  }

  public get defaultQuerySize() {
    return parseInteger(
      this.getWithDefault<number>("DEFAULT_QUERY_SIZE", 100),
      100
    );
  }

  protected abstract innerGet: <T = any>(name: string) => T | undefined;

  protected abstract innerGetAsync: <T = any>(
    name: string
  ) => Promise<T | undefined>;
}
