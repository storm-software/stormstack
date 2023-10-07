/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DEFAULT_OPTIONS as DEFAULT_SHARED_OPTIONS,
  EnvManager
} from "@stormstack/core-shared-env";
import {
  BaseOptions,
  EnvironmentType
} from "@stormstack/core-shared-env/types";
import { Provider } from "@stormstack/core-shared-injection";
import {
  isEmpty,
  isPromise
} from "@stormstack/core-shared-utilities/common/type-checks";
import { EnvConfigurationError } from "@stormstack/core-shared-utilities/errors/env-configuration-error";

export const DEFAULT_OPTIONS: Partial<BaseOptions> = {
  ...DEFAULT_SHARED_OPTIONS,
  isServer: true
};

@Provider(EnvManager)
export class ServerEnvManager<
  TOptions extends Omit<BaseOptions, "env"> &
    Required<Pick<BaseOptions, "env">> = Omit<BaseOptions, "env"> &
    Required<Pick<BaseOptions, "env">>
> extends EnvManager<TOptions> {
  constructor(options = DEFAULT_OPTIONS) {
    super({ ...DEFAULT_OPTIONS, ...options } as TOptions);
  }

  public override get environment(): EnvironmentType {
    let _environment = this.get<EnvironmentType>("NODE_ENV");
    if (isEmpty(_environment)) {
      console.error("Environment variable NODE_ENV is not defined.");

      // Default to production since the rules are stricter.
      _environment = EnvironmentType.PRODUCTION;
    }

    if (isEmpty(this.get<boolean>("HS_ENVIRONMENT"))) {
      this.set("HS_ENVIRONMENT", _environment);
    }
    if (isEmpty(this.get<boolean>("INFISICAL_ENVIRONMENT"))) {
      this.set("INFISICAL_ENVIRONMENT", _environment);
    }
    if (isEmpty(this.get<boolean>("HIVE_ENVIRONMENT"))) {
      this.set("HIVE_ENVIRONMENT", _environment);
    }

    return _environment as EnvironmentType;
  }

  public override get isCI(): boolean {
    const _isCI = !!this.get<boolean>("CI");
    if (_isCI === true && isEmpty(this.get<boolean>("NX_VERBOSE_LOGGING"))) {
      this.set("NX_VERBOSE_LOGGING", true);
    }

    return _isCI;
  }

  public override get repositoryWorker(): string {
    const _repositoryWorker = this.get<string>("CI_REPO_WORKER");
    if (_repositoryWorker && isEmpty(this.get<string>("GITHUB_ACTOR"))) {
      this.set("GITHUB_ACTOR", _repositoryWorker);
    }

    return _repositoryWorker || "";
  }

  public get githubActor(): string {
    let _githubActor = this.get<string>("GITHUB_ACTOR");
    if (!_githubActor) {
      _githubActor = this.get<string>("GH_ACTOR");
    }

    if (_githubActor) {
      if (isEmpty(this.get<string>("CI_REPO_WORKER"))) {
        this.set("CI_REPO_WORKER", _githubActor);
      }
      if (isEmpty(this.get<string>("GH_ACTOR"))) {
        this.set("GH_ACTOR", _githubActor);
      }
      if (isEmpty(this.get<string>("GITHUB_ACTOR"))) {
        this.set("GITHUB_ACTOR", _githubActor);
      }
    } else if (!isEmpty(this.get<string>("CI_REPO_WORKER"))) {
      const _githubActor = this.get<string>("CI_REPO_WORKER");
      if (_githubActor && isEmpty(this.get<string>("GH_ACTOR"))) {
        this.set("GH_ACTOR", _githubActor);
      }
      if (_githubActor && isEmpty(this.get<string>("GITHUB_ACTOR"))) {
        this.set("GITHUB_ACTOR", _githubActor);
      }
    }

    return _githubActor || "";
  }

  public get githubToken(): Promise<string> {
    return this.getAsync<string>("GITHUB_TOKEN");
  }

  public get heliosToken(): Promise<string> {
    return this.getAsync("HS_TOKEN");
  }

  public get heliosEnvironment(): string {
    return this.get("HS_ENVIRONMENT");
  }

  public get heliosServiceName(): string {
    return this.get("HS_SERVICE_NAME");
  }

  public get virusTotalUrl(): URL | undefined {
    const url = this.get("VIRUS_TOTAL_API_KEY");

    return url ? new URL(url) : undefined;
  }

  /*public get helios() {
    return {
      token: this.env["HS_TOKEN"],
      environment: this.env["HS_ENVIRONMENT"],
      serviceName: this.env["HS_SERVICE_NAME"]
    };
  }

  public get bundlewatch() {
    return {
      token: this.env["BUNDLEWATCH_GITHUB_TOKEN"]
    };
  }

  public get virusTotal() {
    return {
      apiKey: this.env["VIRUS_TOTAL_API_KEY"]
    };
  }

  public get kafka() {
    return {
      username: this.env["UPSTASH_KAFKA_REST_USERNAME"],
      password: this.env["UPSTASH_KAFKA_REST_PASSWORD"],
      serverUrl: this.env["UPSTASH_KAFKA_REST_URL"]
    };
  }

  public get sentry() {
    return {
      token: this.env["SENTRY_AUTH_TOKEN"],
      properties: this.env["SENTRY_PROPERTIES"],
      organization: this.env["SENTRY_ORGANIZATION"]
    };
  }

  public get gateway() {
    return {
      allowedOrigins: this.isProduction
        ? [this.baseUrl]
        : ["http://localhost:3000", this.env["WG_ALLOWED_ORIGIN"]]
    };
  }*/

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
    const value = this.proxy[name] as T | undefined;
    if (isPromise(value)) {
      return await value;
    }

    return value;
  };
}
