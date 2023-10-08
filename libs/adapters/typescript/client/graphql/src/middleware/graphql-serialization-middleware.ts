import { SerializationMiddleware } from "@stormstack/core-client-api/middleware/serialization-middleware";
import { ApiClientRequest } from "@stormstack/core-client-api/types";
import {
  HeaderTypes,
  HttpMethods,
  MediaTypes
} from "@stormstack/core-shared-api/types";

export class GraphQLSerializationMiddleware extends SerializationMiddleware {
  /**
   * Called before serializing the request options
   *
   * @param options The request options that will be used by fetch
   * @returns The request options updated in some way
   */
  public override preSerialize(options: ApiClientRequest): ApiClientRequest {
    const { text: operation, name, variables } = options.body;

    options.method = HttpMethods.POST;
    options.headers = {
      ...options.headers,
      [HeaderTypes.CONTENT_TYPE]: MediaTypes.JSON,
      [HeaderTypes.ACCEPT]: MediaTypes.JSON
    };
    options.body = {
      query: operation,
      variables,
      operationName: name
    };

    return options;
  }
}
