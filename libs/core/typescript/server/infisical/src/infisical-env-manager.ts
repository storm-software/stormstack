/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DEFAULT_OPTIONS as DEFAULT_SHARED_OPTIONS,
  EnvManager
} from "@open-system/core-shared-env";
import {
  BaseOptions,
  EnvironmentType
} from "@open-system/core-shared-env/types";
import { Service } from "@open-system/core-shared-injection";
import { Logger, isEmpty, isPromise } from "@open-system/core-shared-utilities";
import { EnvConfigurationError } from "@open-system/core-shared-utilities/errors/env-configuration-error";
import { getInfisicalClient } from "./infisical-client";

export const DEFAULT_OPTIONS: BaseOptions = {
  ...DEFAULT_SHARED_OPTIONS,
  isServer: true,
  handler: async (
    prop: string,
    options: Omit<BaseOptions, "env"> & Required<Pick<BaseOptions, "env">>
  ) => {
    const { INFISICAL_TOKEN, INFISICAL_ENVIRONMENT, NODE_ENV } = options.env;
    if (!INFISICAL_TOKEN || typeof INFISICAL_TOKEN !== "string") {
      throw new EnvConfigurationError(
        "INFISICAL_TOKEN",
        `The environment variable "INFISICAL_TOKEN" is required to connect to the Infisical system.`
      );
    }

    return await getInfisicalClient(INFISICAL_TOKEN).getSecret(prop, {
      environment: (INFISICAL_ENVIRONMENT ?? NODE_ENV) as string,
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
> extends EnvManager<TOptions> {
  constructor(logger: Logger, options = DEFAULT_OPTIONS) {
    super(logger, { ...DEFAULT_OPTIONS, ...options } as TOptions);
  }

  public override get environment(): EnvironmentType {
    let _environment = this.get<EnvironmentType>("NODE_ENV");
    if (isEmpty(_environment)) {
      this.logger.error("Environment variable NODE_ENV is not defined.");

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

  public override get repositoryWorker() {
    const _repositoryWorker = this.get<string>("CI_REPO_WORKER");
    if (_repositoryWorker && isEmpty(this.get<string>("GITHUB_ACTOR"))) {
      this.set("GITHUB_ACTOR", _repositoryWorker);
    }

    return _repositoryWorker || "";
  }

  public get githubActor() {
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

  public get githubToken() {
    return this.getAsync<string>("GITHUB_TOKEN");
  }

  public get heliosToken() {
    return this.getAsync("HS_TOKEN");
  }

  public get heliosEnvironment() {
    return this.get("HS_ENVIRONMENT");
  }

  public get heliosServiceName() {
    return this.get("HS_SERVICE_NAME");
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
