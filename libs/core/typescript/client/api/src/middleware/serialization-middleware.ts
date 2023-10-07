import { MaybePromise } from "@stormstack/core-shared-utilities";
import { ApiClientOptions } from "../client/api-client";
import { ApiClientRequest, ApiClientResult } from "../types";
import {
  deserializeResult,
  serializeRequest
} from "../utilities/serialization";
import { ApiMiddleware } from "./api-middleware";

export class SerializationMiddleware extends ApiMiddleware {
  constructor(options: ApiClientOptions) {
    super(options);
  }

  public override async handle(
    options: ApiClientRequest,
    next: (options: ApiClientRequest) => MaybePromise<ApiClientResult>
  ): Promise<ApiClientResult> {
    // Call next middleware
    const result = await Promise.resolve(
      next(this.postSerialize(serializeRequest(this.preSerialize(options))))
    );

    return this.postDeserialize(deserializeResult(this.preDeserialize(result)));
  }

  /**
   * Called before serializing the request options
   *
   * @param options The request options that will be used by fetch
   * @returns The request options updated in some way
   */
  public preSerialize(options: ApiClientRequest): ApiClientRequest {
    return options;
  }

  /**
   * Called after serializing the request options
   *
   * @param options The serialized request options that will be used by fetch
   * @returns The serialized request options updated in some way
   */
  public postSerialize(options: ApiClientRequest): ApiClientRequest {
    return options;
  }

  /**
   * Called before de-serializing the server response
   *
   * @param result The result object with details returned from the server
   * @returns The result object updated in some way
   */
  public preDeserialize(result: ApiClientResult): ApiClientResult {
    return result;
  }

  /**
   * Called after de-serializing the server response
   *
   * @param result The de-serialized result object with details returned from the server
   * @returns The de-serialized result object updated in some way
   */
  public postDeserialize(result: ApiClientResult): ApiClientResult {
    return result;
  }
}
