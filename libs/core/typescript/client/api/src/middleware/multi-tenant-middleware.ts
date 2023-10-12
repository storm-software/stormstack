import { ClientBaseEnvManager } from "@stormstack/core-client-env";
import { ApiClientResult, HeaderTypes } from "@stormstack/core-shared-api";
import { Injector } from "@stormstack/core-shared-injection";
import { MaybePromise } from "@stormstack/core-shared-utilities";
import { ApiClientOptions } from "../client/api-client";
import { ApiClientRequest } from "../types";
import { ApiMiddleware } from "./api-middleware";

export class MultiTenantMiddleware extends ApiMiddleware {
  private readonly _env: ClientBaseEnvManager;

  constructor(options: ApiClientOptions) {
    super(options);

    this._env = Injector.get<ClientBaseEnvManager>(ClientBaseEnvManager);
  }

  public override handle(
    options: ApiClientRequest,
    next: (options: ApiClientRequest) => MaybePromise<ApiClientResult>
  ): MaybePromise<ApiClientResult> {
    if (!options.headers[HeaderTypes.X_TENANT_ID] && this._env.tenantId) {
      options.headers[HeaderTypes.X_TENANT_ID] = this._env.tenantId;
    }

    // Call next middleware
    return next(options);
  }
}
