import {
  ApiClientResult,
  HeadersProxy,
  UploadList
} from "@stormstack/core-shared-api";
import {
  RequiredKeysOf,
  SetRequired,
  StormError
} from "@stormstack/core-shared-utilities";

export type EventSourceState = 0 | 1 | 2;
export const EventSourceState = {
  CONNECTING: 0 as EventSourceState,
  OPEN: 1 as EventSourceState,
  CLOSED: 2 as EventSourceState
};

export interface FetchOptions extends RequestInit {
  customFetch?: (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<Response>;
  url: string | URL;
  headers: HeadersProxy;
  timeoutMs?: number;
  body?: string;
}

export const API_CLIENT_SYMBOL = Symbol("api-client");

export type SubscriptionEventHandler<
  TData = any,
  TError extends StormError = StormError
> = (result: ApiClientResult<TData, TError>) => void;

export type RequestOptions<TInput = any> = WithInput<TInput> &
  Partial<Omit<FetchOptions, "body">> & {
    /**
     * The URL to make the request to
     */
    url?: string | URL;

    /**
     * The abort signal used to cancel the request
     */
    signal?: AbortSignal;

    /**
     * Whether the request requires authentication
     *
     * @default false
     */
    requireAuth?: boolean;

    /**
     * How long should the client wait before timing out?
     *
     * @default 10000
     */
    timeoutMs?: number;

    /**
     * How many times should the client try to reconnect before it errors out?
     *
     * @default 3
     */
    retryAttempts?: number;

    /**
     * Subscribe to a live query
     */
    isLive?: boolean;

    /**
     * The `onResult` property is used to store the callback function that is called when the API request is completed.
     *
     * @param response The API response
     */
    onResult?: (response: ApiClientResult) => void;

    /**
     * The `onSuccess` property is used to store the callback function that is called when the API request is successful.
     *
     * @param response The API response
     */
    onSuccess?: (response: ApiClientResult) => void;

    /**
     * The `onError` property is used to store the callback function that is called when the API request fails.
     *
     * @param error The API error
     */
    onError?: (error: StormError) => void;

    /**
     * The `onAbort` property is used to store the callback function that is called when the API request is aborted.
     */
    onAbort?: () => void;
  };

export interface ApiClientRequest extends FetchOptions {
  /**
   * Whether the request requires authentication
   *
   * @default false
   */
  requireAuth?: boolean;

  /**
   * The URL Query Parameters to send with the request
   */
  queryParams?: Record<string, any>;

  /**
   * The body of the request
   */
  body?: any;
}

export type QueryRequestOptions<
  TInput extends Record<string, any> = Record<string, any>
> = RequestOptions<TInput> & {
  /**
   * Receive the initial response and then stop the subscription
   */
  subscribeOnce?: boolean;
};

export type MutationRequestOptions<TInput = any> = RequestOptions<TInput>;

export type SubscriptionRequestOptions<
  TInput extends Record<string, any> = Record<string, any>
> = QueryRequestOptions<TInput> & {
  enabled?: boolean;
};

export type SubscriptionToRequestOptions<
  TInput extends Record<string, any> = Record<string, any>
> = Omit<SubscriptionRequestOptions<TInput>, "onResult"> &
  Required<Pick<SubscriptionRequestOptions<TInput>, "onResult">>;

export type UploadRequestOptions = MutationRequestOptions<UploadList> &
  UploadValidationOptions;

export type AuthRequestInput = {
  /**
   * This property is used to specify the authentication provider ID when making a logout request.
   *
   * @link [Auth.js Provider Documentation](https://authjs.dev/guides/providers/credentials)
   */
  providerId?: string;
};

export type LoginRequestOptions = MutationRequestOptions<AuthRequestInput>;

export type LogoutRequestOptions = MutationRequestOptions<AuthRequestInput>;

export type CurrentUserRequestOptions = QueryRequestOptions & {
  revalidate?: boolean;
};

export interface UploadValidationOptions {
  /** Whether authentication is required to upload to this profile
   *
   * @default true
   */
  requireAuthentication?: boolean;

  /** Maximum file size allowed per upload
   *
   * @default 10 * 1024 * 1024 (10MB)
   */
  maxAllowedUploadSizeBytes?: number;

  /** Maximum number of files allowed per upload
   *
   * @default unlimited
   */
  maxAllowedFiles?: number;

  /** List of allowed file extensions
   *
   * @default Any
   */
  allowedFileExtensions?: string[];

  /** List of allowed mime types
   *
   * @default Any
   */
  allowedMimeTypes?: string[];
}

export const UploadValidationOptionsDefaults: UploadValidationOptions = {
  requireAuthentication: true,
  maxAllowedUploadSizeBytes: 10 * 1024 * 1024,
  maxAllowedFiles: Infinity,
  allowedFileExtensions: [
    "css",
    "csv",
    "doc",
    "docx",
    "gif",
    "htm",
    "html",
    "jpg",
    "jpeg",
    "svg",
    "ico",
    "mpg",
    "mpeg",
    "mp3",
    "odt",
    "odp",
    "ods",
    "pdf",
    "ppt",
    "pptx",
    "tif",
    "tiff",
    "tsv",
    "txt",
    "xls",
    "xlsx",
    "wav"
  ],
  allowedMimeTypes: [
    "multipart/form-data",
    "text/xml",
    "text/css",
    "text/csv",
    "text/plain",
    "text/html",
    "text/tab-separated-values",
    "image/jpeg",
    "image/gif",
    "image/svg+xml",
    "image/x-icon",
    "video/mpeg",
    "video/mp4",
    "application/xml",
    "application/x-gzip",
    "application/x-tar",
    "application/x-compressed",
    "application/zip",
    "application/pdf",
    "application/msword"
  ]
};

export interface UploadResponse {
  fileKeys: string[];
}

export interface LogoutResponse {
  redirect?: string;
}

export interface SubscriptionResult {
  streamState: "streaming" | "stopped" | "restarting";
  data: any;
}

export type HasRequiredInput<TInput = any> = TInput extends object
  ? RequiredKeysOf<TInput> extends never
    ? false
    : true
  : false;

export type WithInput<TInput = any> = HasRequiredInput<TInput> extends true
  ? SetRequired<{ input?: TInput }, "input">
  : { input?: TInput };

export const API_MIDDLEWARE_SYMBOL = Symbol("API_MIDDLEWARE_SYMBOL");
