import { GraphQLHeaderTypes } from "@stormstack/adapters-shared-graphql";
import {
  ApiClientRequest,
  SerializationMiddleware
} from "@stormstack/core-client-api";
import { HeaderTypes, HttpMethods } from "@stormstack/core-shared-api";
import { MediaTypes } from "@stormstack/core-shared-state";

export class GraphQLSerializationMiddleware extends SerializationMiddleware {
  /**
   * Called before serializing the request options
   *
   * @param options The request options that will be used by fetch
   * @returns The request options updated in some way
   */
  public override preSerialize(options: ApiClientRequest): ApiClientRequest {
    const { request, variables } = options.body;
    const { text: operation, name: operationName } = request;

    options.headers.set(
      GraphQLHeaderTypes.X_DOC_ID,
      request.id ?? request.cacheID
    );
    options.headers.set(GraphQLHeaderTypes.X_OPERATION_NAME, operationName);

    options.method = HttpMethods.POST;
    options.headers = {
      ...options.headers,
      [HeaderTypes.CONTENT_TYPE]: MediaTypes.JSON,
      [HeaderTypes.ACCEPT]: MediaTypes.JSON
    };
    options.body = {
      query: operation,
      variables,
      operationName
    };

    return options;
  }
}
