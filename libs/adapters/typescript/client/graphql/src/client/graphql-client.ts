import { applyLiveQueryJSONDiffPatch } from "@n1ru4l/graphql-live-query-patch-jsondiffpatch";
import { applyAsyncIterableIteratorToSink } from "@n1ru4l/push-pull-async-iterable-iterator";
import {
  ApiClient,
  ApiClientOptions,
  ApiClientResult,
  ApiClientResultStatus,
  ApiMiddleware,
  ApiMiddlewareStack,
  RequestOptions
} from "@stormstack/core-client-api";
import { ApiErrorCode } from "@stormstack/core-shared-api";
import { StormError } from "@stormstack/core-shared-utilities";
import { GraphQLSerializationMiddleware } from "../middleware";
import { IVariables, RequestParameters, Sink } from "../types";

export interface GraphQLClientOptions extends ApiClientOptions {
  /**
   * Force SSE for subscriptions if extraHeaders are set.
   * Subscriptions fall back to fetch streaming by default
   * if extraHeaders are set, because EventSource does not
   * supported headers.
   */
  forceSSE?: boolean;

  /**
   * Middleware to be used by the client.
   * Middleware is executed in the order they are defined.
   */
  middleware?: Array<new (options: GraphQLClientOptions) => ApiMiddleware>;
}

export class GraphQLClient extends ApiClient {
  constructor(protected override options: GraphQLClientOptions = {}) {
    super(options);

    if (this.options.middleware) {
      this.middlewareStack = this.options.middleware.reduce(
        (
          ret: ApiMiddlewareStack,
          MiddlewareConstructor: new (
            options: ApiClientOptions
          ) => ApiMiddleware
        ) => {
          ret.use(new MiddlewareConstructor(this.options));

          return ret;
        },
        this.middlewareStack
      );
    }
    this.middlewareStack.use(new GraphQLSerializationMiddleware(this.options));
  }

  public observable = <
    TVariables extends IVariables = IVariables,
    TRequestOptions extends RequestOptions = RequestOptions,
    TData = any,
    TError extends StormError = StormError
  >(
    request: RequestParameters<TVariables>,
    options: TRequestOptions,
    sink: Sink
  ) => {
    const {
      text: operation,
      name: operationName,
      operationKind,
      providedVariables: variables
    } = request;

    if (operation?.includes("@live") || operationKind === "subscription") {
      return applyAsyncIterableIteratorToSink(
        applyLiveQueryJSONDiffPatch(
          this.subscribe({
            url: new URL(options.url.toString()),
            input: { query: operation, variables },
            headers: this.headersProxy
          })
        ),
        sink
      );
    }

    this.fetch<TData, TError>({
      ...options,
      body: {
        doc_id: request.id,
        variables,
        operationName
      }
    })
      .then((result: ApiClientResult<TData, TError>) => {
        if (result.status === ApiClientResultStatus.ERROR) {
          sink.error(
            result.error ?? new StormError(ApiErrorCode.connection_failure)
          );
        } else {
          sink.next(result);
          sink.complete();
        }
      })
      .catch(error => {
        sink.error(error);
      });
  };
}
