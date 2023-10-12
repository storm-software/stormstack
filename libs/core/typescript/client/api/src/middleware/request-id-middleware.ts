import { ApiClientResult, HeaderTypes } from "@stormstack/core-shared-api";
import {
  MaybePromise,
  UniqueIdGenerator
} from "@stormstack/core-shared-utilities";
import { ApiClientOptions } from "../client/api-client";
import { ApiClientRequest } from "../types";
import { ApiMiddleware } from "./api-middleware";

export class RequestIdMiddleware extends ApiMiddleware {
  constructor(options: ApiClientOptions) {
    super(options);
  }

  public override handle(
    options: ApiClientRequest,
    next: (options: ApiClientRequest) => MaybePromise<ApiClientResult>
  ): MaybePromise<ApiClientResult> {
    if (!options.headers[HeaderTypes.X_REQUEST_ID]) {
      options.headers[HeaderTypes.X_REQUEST_ID] = UniqueIdGenerator.generate();
    }

    // Call next middleware
    return next(options);
  }
}
