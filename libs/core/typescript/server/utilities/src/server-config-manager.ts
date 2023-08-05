import { ConfigManager } from "@open-system/core-shared-utilities/config";

export class ServerConfigManager extends ConfigManager {
  public static override get instance() {
    if (
      !ServerConfigManager._instance ||
      typeof ServerConfigManager._instance !== typeof ServerConfigManager
    ) {
      ServerConfigManager._instance = {
        ...new ConfigManager(),
        ...new ServerConfigManager(),
      } as any;
    }

    return ServerConfigManager._instance;
  }

  public get helios() {
    return {
      token: this.env["HS_TOKEN"],
      environment: this.env["HS_ENVIRONMENT"],
      serviceName: this.env["HS_SERVICE_NAME"],
    };
  }

  public get bundlewatch() {
    return {
      token: this.env["BUNDLEWATCH_GITHUB_TOKEN"],
    };
  }

  public get virusTotal() {
    return {
      apiKey: this.env["VIRUS_TOTAL_API_KEY"],
    };
  }

  public get kafka() {
    return {
      username: this.env["UPSTASH_KAFKA_REST_USERNAME"],
      password: this.env["UPSTASH_KAFKA_REST_PASSWORD"],
      serverUrl: this.env["UPSTASH_KAFKA_REST_URL"],
    };
  }

  public get sentry() {
    return {
      token: this.env["SENTRY_AUTH_TOKEN"],
      properties: this.env["SENTRY_PROPERTIES"],
      organization: this.env["SENTRY_ORGANIZATION"],
    };
  }

  public get gateway() {
    return {
      allowedOrigins: this.isProduction
        ? [this.baseUrl]
        : ["http://localhost:3000", this.env["WG_ALLOWED_ORIGIN"]],
    };
  }
}
