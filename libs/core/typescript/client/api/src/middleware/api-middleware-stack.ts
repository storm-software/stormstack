import {
  ApiClientResult,
  ApiClientResultStatus,
  createApiHeadersProxy,
  isStatusCodeSuccessful
} from "@stormstack/core-shared-api";
import { MiddlewareStack } from "@stormstack/core-shared-utilities";
import { ApiClientRequest } from "../types";
import { handleFetch } from "../utilities";

/**
 * A middleware container and invoker
 */
export class ApiMiddlewareStack extends MiddlewareStack<
  ApiClientRequest,
  ApiClientResult
> {
  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public override get __base(): string {
    return "ApiMiddlewareStack";
  }

  /**
   * Terminates the middleware stack and returns the result
   */
  protected terminate = async (
    request: ApiClientRequest
  ): Promise<ApiClientResult> => {
    const response = await handleFetch({ ...request });

    return {
      ...response,
      status: isStatusCodeSuccessful(response.status)
        ? ApiClientResultStatus.SUCCESS
        : ApiClientResultStatus.ERROR,
      data: response,
      headers: createApiHeadersProxy(response.headers)
    };
  };
}
