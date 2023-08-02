import { BaseUtilityClass } from "../common";
import { CONFIG_TOKEN } from "../types";

export class ConfigManager extends BaseUtilityClass {
  protected static _instance: ConfigManager;

  public static get instance() {
    if (!ConfigManager._instance) {
      ConfigManager._instance = new ConfigManager();
    }

    return ConfigManager._instance;
  }

  #env = process?.env;

  protected constructor() {
    super(CONFIG_TOKEN);
  }

  public get env() {
    return this.#env;
  }

  public get defaults() {
    return {
      locale: this.env.NEXT_PUBLIC_DEFAULT_LOCALE,
      timezone: this.env.NEXT_PUBLIC_DEFAULT_TIMEZONE,
    };
  }

  public get repository() {
    return {
      owner: this.env.CI_REPO_OWNER,
      name: this.env.CI_REPO_NAME,
      branch: this.env.CI_BRANCH,
    };
  }

  public get logging() {
    return {
      logLevel: this.env.LOG_LEVEL,
    };
  }

  public get environment() {
    return this.env.NODE_ENV;
  }

  public get isDevelopment() {
    return (
      this.environment === "development" ||
      this.env.GITPOD_WORKSPACE_ID !== undefined
    );
  }

  public get isProduction() {
    return !this.isDevelopment && this.environment === "production";
  }

  public get baseUrl() {
    return this.isDevelopment
      ? "http://localhost:3000"
      : this.env.NEXT_PUBLIC_BASE_URL;
  }
}
