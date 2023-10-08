import { JsonObject, JsonValue } from "@stormstack/core-shared-serialization";
import { AnyCase } from "@stormstack/core-shared-utilities";
import { HeadersMap } from "./utilities";

export type ApiErrorSeverity = "error" | "warning" | "info";
export const ApiErrorSeverity = {
  ERROR: "error" as ApiErrorSeverity,
  WARNING: "warning" as ApiErrorSeverity,
  INFO: "info" as ApiErrorSeverity
};

/**
 * The `ApiErrorPayload` interface defines the structure of an error
 * object that can be returned in an API response.
 *
 * @remarks This object is expected to be extended in an adapter package (e.g. `@stormstack/adapters-shared-graphql`, `@stormstack/adapters-shared-trpc`, `@stormstack/adapters-shared-rest`, etc.)
 */
export interface ApiErrorPayload {
  message: string;
}

/**
 * The StormStack base API response body format.
 *
 * @remarks This object is expected to be extended in an adapter package (e.g. `@stormstack/adapters-shared-graphql`, `@stormstack/adapters-shared-trpc`, `@stormstack/adapters-shared-rest`, etc.)
 */
export interface ApiResponsePayload<TData extends JsonValue = JsonValue> {
  /**
   * Used to store the actual data returned by the API response.
   */
  data?: TData;
}

/**
 * The StormStack base API response.
 *
 * @remarks This object is expected to be extended in an adapter package (e.g. `@stormstack/adapters-shared-graphql`, `@stormstack/adapters-shared-trpc`, `@stormstack/adapters-shared-rest`, etc.)
 * @remarks Extends the `Response` interface from the Fetch API.
 * @link [Response Reference Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 */
export type ApiResponse<
  TPayload extends ApiResponsePayload = ApiResponsePayload
> = Response & TPayload;

export interface ApiRequest<TData extends JsonValue = JsonValue> {
  method: HttpMethods;
  url: string;
  headers: Headers;
  body?: TData;
}

export interface ApiFile {
  /**
   * Filename of the file, as returned by the browser.
   */
  readonly name: string;
  /**
   * Size of the file, in bytes
   */
  readonly size: number;
  /**
   * File mimetype
   */
  readonly type: string;
}

export type ApiAuthenticationStatus = "ok" | "deny";
export const ApiAuthenticationStatus = {
  OK: "ok" as ApiAuthenticationStatus,
  DENY: "deny" as ApiAuthenticationStatus
};

export interface ApiAuthenticationOK<TApiUser extends ApiUser = ApiUser> {
  status: "ok";
  user: TApiUser;
}

export interface ApiAuthenticationDeny {
  status: "deny";
  message: string;
}

export interface ApiUser<
  TRole extends string = any,
  TCustomClaims extends {} = {}
> {
  userId?: string;
  name?: string;
  email?: string;
  roles?: TRole[];
  customAttributes?: string[];
  customClaims?: {
    [key: string]: any;
  } & TCustomClaims;
  accessToken?: JsonObject;
  rawAccessToken?: string;
  idToken?: JsonObject;
  rawIdToken?: string;
  refreshToken?: string;
}

/**
 *
 * @export
 */
export const CollectionFormats = {
  CSV: ",",
  SSV: " ",
  TSV: "\t",
  PIPES: "|"
};

export interface HttpFetchApi {
  signal: AbortSignal;
  abort: (reason?: string) => void;
  dispatch: (action: any) => any;
  getState: () => unknown;
  extra: unknown;
  endpoint: string;
  type: "query" | "mutation";
  /**
   * Only available for queries: indicates if a query has been forced,
   * i.e. it would have been fetched even if there would already be a cache entry
   * (this does not mean that there is already a cache entry though!)
   *
   * This can be used to for example add a `Cache-Control: no-cache` header for
   * invalidated queries.
   */
  forced?: boolean;
}

export type MediaTypes =
  | "application/json"
  | "application/xml"
  | "application/problem+json"
  | "application/problem+xml"
  | "application/octet-stream"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/plain"
  | "text/html"
  | "application/graphql-response+json";
export const MediaTypes = {
  JSON: "application/json" as MediaTypes,
  XML: "application/xml" as MediaTypes,
  PROBLEM_JSON: "application/problem+json" as MediaTypes,
  PROBLEM_XML: "application/problem+xml" as MediaTypes,
  OCTET_STREAM: "application/octet-stream" as MediaTypes,
  FORM_URLENCODED: "application/x-www-form-urlencoded" as MediaTypes,
  FORM_DATA: "multipart/form-data" as MediaTypes,
  TEXT_PLAIN: "text/plain" as MediaTypes,
  HTML: "text/html" as MediaTypes,
  GRAPHQL_RESPONSE_JSON: "application/graphql-response+json" as MediaTypes
};

export type HttpMethods = "DELETE" | "GET" | "HEAD" | "POST" | "PUT" | "PATCH";
export const HttpMethods = {
  DELETE: "DELETE" as HttpMethods,
  GET: "GET" as HttpMethods,
  HEAD: "HEAD" as HttpMethods,
  POST: "POST" as HttpMethods,
  PUT: "PUT" as HttpMethods,
  PATCH: "PATCH" as HttpMethods
};

export type CredentialOptions = "include" | "same-origin" | "omit";
export const CredentialOptions = {
  INCLUDE: "include" as CredentialOptions,
  SAME_ORIGIN: "same-origin" as CredentialOptions,
  OMIT: "omit" as CredentialOptions
};

type RequestModes = "same-origin" | "cors" | "navigate" | "no-cors";
export const RequestModes = {
  SAME_ORIGIN: "same-origin" as RequestModes,
  CORS: "cors" as RequestModes,
  NAVIGATE: "navigate" as RequestModes,
  NO_CORS: "no-cors" as RequestModes
};

export type HeaderTypes =
  | "x-api-key"
  | "accept"
  | "content-type"
  | "x-csrf-token"
  | "set-cookie"
  | "storm-sdk-version"
  | "x-upload-profile"
  | "x-metadata"
  | "x-request-id"
  | "x-correlation-id"
  | "x-tenant-id"
  | "authorization";
export const HeaderTypes = {
  X_API_KEY: "x-api-key" as HeaderTypes,
  ACCEPT: "accept" as HeaderTypes,
  CONTENT_TYPE: "content-type" as HeaderTypes,
  X_CSRF_TOKEN: "x-csrf-token" as HeaderTypes,
  SET_COOKIE: "set-cookie" as HeaderTypes,
  STORM_SDK_VERSION: "storm-sdk-version" as HeaderTypes,
  X_UPLOAD_PROFILE: "x-upload-profile" as HeaderTypes,
  X_METADATA: "x-metadata" as HeaderTypes,
  X_REQUEST_ID: "x-request-id" as HeaderTypes,
  X_CORRELATION_ID: "x-correlation-id" as HeaderTypes,
  X_TENANT_ID: "x-tenant-id" as HeaderTypes,
  AUTHORIZATION: "authorization" as HeaderTypes
};

export type HeadersProxy<
  TKey extends keyof (HeaderTypes & any) = keyof (HeaderTypes & any)
> = Record<AnyCase<TKey>, any> & {
  has: (key: string) => boolean;
  get: (key: string) => string;
  set: (key: string, value: string) => void;
  merge: (params?: HeadersProxy<TKey> | HeadersMap | Headers) => void;
  delete: (key: string) => void;
  cookie: string | undefined;
  keys: IterableIterator<string>;
  values: IterableIterator<string>;
  entries: IterableIterator<[string, string]>;
  forEach: (callbackfn: (value: string, key: string) => void) => void;
  append: (key: string, value: string) => void;
  getAll: (key: string) => string[];
  clone: () => HeadersProxy<TKey>;
  normalize: (headers: Headers) => HeadersMap;
  headers: Headers;
  [Symbol.iterator]: IterableIterator<[string, string]>;
};

/**
 * Contains a page of results for message or presence history, stats, or REST presence requests. A `PaginatedResult` response from a REST API paginated query is also accompanied by metadata that indicates the relative queries available to the `PaginatedResult` object.
 */
export interface ApiPaginatedResponse<T = any> {
  /**
   * Contains the current page of results; for example, an array of {@link Message} or {@link PresenceMessage} objects for a channel history request.
   */
  data: T[];

  /**
   * Amount of records returned by request
   */
  count: number;

  /**
   * Total amount of records in the view store
   */
  total: number;

  /**
   * Amount of records to offset the search request
   */
  offset: number;

  /**
   * Returns `true` if this page is the last page and returns `false` if there are more pages available by calling next available.
   *
   * @returns Whether or not this is the last page of results.
   */
  isLast: boolean;
}
