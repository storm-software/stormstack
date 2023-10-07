import {
  HttpStatusCode,
  createApiHeadersProxy,
  isStatusCodeSuccessful
} from "@stormstack/core-shared-api";
import { DateTime, MiddlewareStack } from "@stormstack/core-shared-utilities";
import {
  ApiClientRequest,
  ApiClientResult,
  ApiClientResultStatus
} from "../types";
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
    const requestAt = DateTime.current;

    const response = await handleFetch({ ...request });

    const responseAt = DateTime.current;

    return {
      headers: createApiHeadersProxy(response.headers),
      status: isStatusCodeSuccessful(response.status)
        ? ApiClientResultStatus.SUCCESS
        : ApiClientResultStatus.ERROR,
      request,
      requestAt,
      responseAt,
      data: response,
      httpStatusCode: response.status as HttpStatusCode
    };
  };
}
