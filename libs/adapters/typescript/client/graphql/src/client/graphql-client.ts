import { applyLiveQueryJSONDiffPatch } from "@n1ru4l/graphql-live-query-patch-jsondiffpatch";
import { applyAsyncIterableIteratorToSink } from "@n1ru4l/push-pull-async-iterable-iterator";
import { GraphQLOperationKind } from "@stormstack/adapters-shared-graphql";
import {
  ApiClient,
  ApiClientOptions,
  ApiMiddleware,
  ApiMiddlewareStack
} from "@stormstack/core-client-api";
import { ClientBaseEnvManager } from "@stormstack/core-client-env";
import {
  ApiClientResult,
  ApiClientResultStatus,
  ApiErrorCode
} from "@stormstack/core-shared-api";
import { StormError } from "@stormstack/core-shared-utilities";
import { GraphQLSerializationMiddleware } from "../middleware";
import { GraphQLRequestOptions, Sink } from "../types";

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
  constructor(
    env: ClientBaseEnvManager,
    protected override options: GraphQLClientOptions = {}
  ) {
    super(env, options);

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

  public graphQLOperation = async (
    request: GraphQLRequestOptions,
    sink: Sink
  ) => {
    try {
      const { input, isLive, operationKind } = request;

      if (
        isLive ||
        operationKind.toUpperCase() ===
          GraphQLOperationKind.LIVE_QUERY.toUpperCase() ||
        operationKind.toUpperCase() ===
          GraphQLOperationKind.SUBSCRIPTION.toUpperCase()
      ) {
        return applyAsyncIterableIteratorToSink(
          applyLiveQueryJSONDiffPatch(
            this.subscribe({
              input: {
                doc_id: request.operationName,
                variables: request.input
              }
            })
          ),
          sink
        );
      }

      let result!: ApiClientResult;
      if (
        operationKind.toUpperCase() ===
          GraphQLOperationKind.QUERY.toUpperCase() ||
        operationKind.toUpperCase() ===
          GraphQLOperationKind.PRELOADED_QUERY.toUpperCase()
      ) {
        result = await this.query({
          input: {
            doc_id: request.operationName,
            variables: request.input
          }
        });
      } else {
        result = await this.mutate({
          input: {
            doc_id: request.operationName,
            variables: request.input
          }
        });
      }
      if (result.status === ApiClientResultStatus.ERROR) {
        sink.error(
          result.error
            ? result.error
            : new StormError(ApiErrorCode.connection_failure)
        );
      } else {
        sink.next(result);
        sink.complete();
      }
    } catch (error) {
      sink.error(
        StormError.isStormError(error)
          ? error
          : new StormError(ApiErrorCode.connection_failure)
      );
    }
  };
}
