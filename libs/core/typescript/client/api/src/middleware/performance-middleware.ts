import { ClientBaseEnvManager } from "@stormstack/core-client-env";
import { Injector } from "@stormstack/core-shared-injection";
import { Logger } from "@stormstack/core-shared-logging";
import { DateTime, MaybePromise } from "@stormstack/core-shared-utilities";
import { ApiClientOptions } from "../client/api-client";
import { ApiClientRequest, ApiClientResult } from "../types";
import { ApiMiddleware } from "./api-middleware";

export class PerformanceMiddleware extends ApiMiddleware {
  private readonly _logger: Logger;
  private readonly _env: ClientBaseEnvManager;
  private readonly _requestWarningMs: number;

  constructor(options: ApiClientOptions) {
    super(options);

    this._logger = Injector.get<Logger>(Logger);
    this._env = Injector.get<ClientBaseEnvManager>(ClientBaseEnvManager);
    this._requestWarningMs = this._env.requestWarningMs;
  }

  public override async handle(
    options: ApiClientRequest,
    next: (options: ApiClientRequest) => MaybePromise<ApiClientResult>
  ): Promise<ApiClientResult> {
    const startDateTime = DateTime.current;

    // Call next middleware
    const response = await Promise.resolve(next(options));

    if (
      DateTime.current.since(startDateTime).milliseconds >
      this._requestWarningMs
    ) {
      this._logger.warn(`Request took longer than ${this._requestWarningMs}ms`);
    }

    return response;
  }
}
