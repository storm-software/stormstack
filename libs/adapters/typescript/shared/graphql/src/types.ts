import {
  ApiErrorSeverity,
  ApiUser,
  HeaderTypes
} from "@stormstack/core-shared-api/types";
import {
  JsonParserResult,
  JsonValue
} from "@stormstack/core-shared-serialization/types";

export type GraphQLHeaderTypes = HeaderTypes | "x-doc-id" | "x-operation-name";
export const GraphQLHeaderTypes = {
  ...HeaderTypes,
  X_DOC_ID: "x-doc-id" as GraphQLHeaderTypes,
  X_OPERATION_NAME: "x-operation-name" as GraphQLHeaderTypes
};

export const GraphQLOperationKind = {
  QUERY: "query",
  MUTATION: "mutation",
  SUBSCRIPTION: "subscription",
  LIVE_QUERY: "liveQuery",
  PRELOADED_QUERY: "preloadedQuery"
} as const;

export interface ApiExtensionsPayload {
  message: string;
  code: string;
  timestamp?: string;
}

export interface ApiErrorExtensionsPayload extends ApiExtensionsPayload {
  extendedMessage?: string;
  severity?: ApiErrorSeverity;
  stacktrace?: string;
  error?: JsonParserResult;
}

/**
 * The `ApiErrorPayload` interface defines the structure of an error
 * object that can be returned in an API response.
 */
export interface ApiErrorPayload<
  TExtensions extends ApiErrorExtensionsPayload = ApiErrorExtensionsPayload
> {
  message: string;
  locations?:
    | Array<{
        line: number;
        column: number;
      }>
    | undefined;
  path?: Array<string | number> | undefined;
  extensions?: TExtensions;
}

/**
 * The StormStack standard API response body format.
 *
 * @remarks The shape matches that of a GraphQL response as dictated by the specifications.
 * @remarks **Please Note:** This format is used by all StormStack API end points (not just GraphQL).
 * @link [The GraphQL spec](https://graphql.github.io/graphql-spec/June2018/#sec-Response-Format)
 */
export interface ApiResponsePayload<
  TData extends JsonValue = JsonValue,
  TExtensions extends ApiExtensionsPayload = ApiExtensionsPayload,
  TError extends ApiErrorPayload = ApiErrorPayload
> {
  /**
   * Used to store the actual data returned by the API response.
   */
  data?: TData;

  /**
   * Used to store any errors that occur during the API response.
   */
  errors?: TError[] | undefined;

  /**
   * Used to store any additional data that is not part of the actual data returned by the API response.
   */
  extensions?: TExtensions;
}

/**
 * The StormStack standard API response.
 *
 * @remarks Extends the `Response` interface from the Fetch API.
 * @link [Response Reference Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 */
export interface GraphQLResult<
  TData extends JsonValue = JsonValue,
  TExtensions extends ApiExtensionsPayload = ApiExtensionsPayload,
  TError extends ApiErrorPayload = ApiErrorPayload
> extends Response,
    ApiResponsePayload<TData, TExtensions, TError> {}

// base interface for the untyped client
export interface ApiOperation {
  input?: object;
  liveQuery?: boolean;
  response: GraphQLResult;
  requiresAuthentication: boolean;
}

export interface ApiOperationMetadata {
  [key: string]: {
    requiresAuthentication: boolean;
  };
}

export interface ApiOperationRequestOptions<
  TInput extends Record<string, any> = Record<string, any>
> {
  /**
   * The name of the operation to be executed.
   */
  operationName: string;

  /**
   * If you pass an AbortSignal, the request will be aborted when the signal is aborted.
   * You are responsible of handling the request timeout if you want to pass a custom AbortSignal.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
   */
  abortSignal?: AbortSignal;

  /**
   * The input to be passed to the operation.
   */
  input?: TInput;
}

export interface ApiOperationsDefinition<
  Queries extends ApiOperationDefinition = ApiOperationDefinition,
  Mutations extends ApiOperationDefinition = ApiOperationDefinition,
  Subscriptions extends ApiOperationDefinition = ApiOperationDefinition,
  LiveQueries extends ApiOperationDefinition = ApiOperationDefinition,
  UserRole extends string = string,
  S3Provider extends S3ProviderDefinition = S3ProviderDefinition,
  AuthProvider extends string = string
> {
  user: ApiUser<UserRole>;
  s3Provider: S3Provider;
  authProvider: AuthProvider;
  queries: Queries;
  mutations: Mutations;
  subscriptions: Subscriptions;
  liveQueries: LiveQueries;
}

export interface ApiOperationDefinition {
  [key: string]: ApiOperation;
}

export interface S3ProviderDefinition {
  [provider: string]: {
    hasProfiles: boolean;
    profiles: {
      [profile: string]: object;
    };
  };
}

export const API_MIDDLEWARE_SYMBOL = Symbol("api-middleware");
