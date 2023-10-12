import { ApiClientResult } from "@stormstack/core-shared-api";
import {
  BaseUtilityClass,
  IMiddleware,
  MaybePromise
} from "@stormstack/core-shared-utilities";
import { ApiClientOptions } from "../client";
import { API_MIDDLEWARE_SYMBOL, ApiClientRequest } from "../types";

export class ApiMiddleware extends BaseUtilityClass implements IMiddleware {
  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public override get __base(): string {
    return "ApiMiddleware";
  }

  constructor(protected options: ApiClientOptions) {
    super(API_MIDDLEWARE_SYMBOL);
  }

  public handle(
    options: ApiClientRequest,
    next: (options: ApiClientRequest) => MaybePromise<ApiClientResult>
  ): MaybePromise<ApiClientResult> {
    // Call next middleware
    return next(options);
  }
}
