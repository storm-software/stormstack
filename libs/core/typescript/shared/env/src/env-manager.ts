/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BaseUtilityClass,
  Logger,
  isEmpty,
  parseInteger
} from "@open-system/core-shared-utilities";
import { createEnvProxy } from "./create-env-proxy";
import { DEFAULT_OPTIONS } from "./env-manager-options";
import { BaseOptions, ENV_TOKEN, EnvProxy, EnvironmentType } from "./types";

export abstract class EnvManager<
  TOptions extends BaseOptions = BaseOptions
> extends BaseUtilityClass {
  protected proxy: EnvProxy;

  constructor(
    protected readonly logger: Logger,
    public readonly options = DEFAULT_OPTIONS as TOptions
  ) {
    super(ENV_TOKEN);

    this.proxy = createEnvProxy({ ...DEFAULT_OPTIONS, ...this.options });
  }

  public get = <T = any>(name: string): T | undefined => {
    this.logger.debug(`Getting environment variable "${name}".`);

    return this.innerGet<T>(name);
  };

  public getAsync = <T = any>(name: string): Promise<T | undefined> => {
    this.logger.debug(
      `Getting external environment variable/secret "${name}".`
    );

    return this.innerGetAsync<T>(name);
  };

  public set = <T extends string | boolean | number | undefined = any>(
    name: string,
    value: T
  ) => {
    this.logger.debug(`Updating environment variable "${name}" to "${value}".`);
    this.proxy[name] = value;
  };

  public get defaultLocale() {
    return this.get<string>("DEFAULT_LOCALE");
  }

  public get defaultTimezone() {
    return this.get<string>("DEFAULT_TIMEZONE");
  }

  public get environment(): EnvironmentType {
    const _environment = this.get<EnvironmentType>("NODE_ENV");
    if (isEmpty(_environment)) {
      this.logger.error("Environment variable NODE_ENV is not defined.");
    }

    // Default to production since the rules are stricter.
    return _environment ?? EnvironmentType.PRODUCTION;
  }

  public get isDevelopment(): boolean {
    return (
      this.environment === EnvironmentType.DEVELOPMENT ||
      this.get("GITPOD_WORKSPACE_ID") !== undefined
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
      : this.get<string>("BASE_URL");
  }

  public get isCI(): boolean {
    return !!this.get<boolean>("CI");
  }

  public get repositoryOwner() {
    return this.get<string>("CI_REPO_OWNER") ?? "sullivanpj";
  }

  public get repositoryWorker(): string {
    return this.get<string>("CI_REPO_WORKER") ?? "🤖 Open-System Bot";
  }

  public get repositoryName(): string {
    return this.get<string>("CI_REPO_NAME") ?? "open-system";
  }

  public get branchName(): string {
    return this.get<string>("CI_BRANCH") ?? "main";
  }

  public get serviceId() {
    return this.get<string>("SERVICE_ID");
  }

  public get serviceName() {
    return this.get<string>("SERVICE_NAME");
  }

  public get serviceUrl() {
    return this.get<string>("SERVICE_URL");
  }

  public get serviceVersion() {
    return this.get<string>("SERVICE_VERSION");
  }

  public get domainName() {
    return this.get<string>("DOMAIN_NAME");
  }

  public get defaultQuerySize() {
    return parseInteger(this.get<number>("DEFAULT_QUERY_SIZE"), 100);
  }

  protected abstract innerGet: <T = any>(name: string) => T | undefined;

  protected abstract innerGetAsync: <T = any>(
    name: string
  ) => Promise<T | undefined>;
}
