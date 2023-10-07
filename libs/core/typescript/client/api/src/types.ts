import { HeaderProxy, HttpStatusCode } from "@stormstack/core-shared-api";
import {
  BaseError,
  DateTime,
  RequiredKeysOf,
  SetRequired
} from "@stormstack/core-shared-utilities";

export type ApiClientResultStatus = "success" | "error" | "pending";
export const ApiClientResultStatus = {
  SUCCESS: "success" as ApiClientResultStatus,
  ERROR: "error" as ApiClientResultStatus,
  PENDING: "pending" as ApiClientResultStatus
};

export interface ApiClientResult<
  TData = any,
  TError extends BaseError = BaseError
> {
  /**
   * The general, display result label of the API response.
   */
  code?: string;

  /**
   * The `status` property in the `ApiClientResult` interface is used to indicate the status of the API request.
   *
   * @remarks It can have one of three possible values: "success", "error", or "pending".
   */
  status: ApiClientResultStatus;

  /**
   * If the API request is successful and returns a value, it will be stored in the `data` property. If there is no data or if an error occurs during the API request, the `data` property will be undefined.
   */
  data?: TData;

  /**
   * Used to store any error that occurs during the API request. If there is no error, the property will be undefined.
   */
  error?: TError;

  /**
   * The `headers` property is used to store the headers from the API response.
   *
   * @remarks This property can be useful for tracking the timing of API requests and measuring performance.
   */
  headers: HeaderProxy;

  /**
   *  The `requestAt` property is used to store the timestamp when the API request was made.
   *
   * @remarks This property can be useful for tracking the timing of API requests and measuring performance.
   */
  requestAt: DateTime;

  /**
   * The `responseAt` property is used to store the timestamp when the API response was received.
   *
   * @remarks This property can be useful for tracking the timing of API requests and measuring performance.
   */
  responseAt?: DateTime;

  /**
   * Used to store the options for the API request. It allows you to pass additional options such as authentication requirements, user authentication status, and other custom options when making an API request.
   */
  request: ApiClientRequest;

  /**
   * The Http Status code returned by the request.
   *
   * @link [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/status)
   */
  httpStatusCode: HttpStatusCode;
}

export interface FetchOptions extends RequestInit {
  customFetch?: (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<Response>;
  url: string | URL;
  headers: HeaderProxy;
  timeoutMs?: number;
  body?: string;
}

export const API_CLIENT_SYMBOL = Symbol("api-client");

export type SubscriptionEventHandler<
  TData = any,
  TError extends BaseError = BaseError
> = (result: ApiClientResult<TData, TError>) => void;

export type RequestOptions<TInput = any> = WithInput<TInput> &
  Omit<FetchOptions, "body"> & {
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
     * @default 5
     */
    retryAttempts?: number;
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
   * Subscribe to a live query
   */
  liveQuery?: Boolean;

  /**
   * Receive the initial response and then stop the subscription
   */
  subscribeOnce?: Boolean;
};

export type MutationRequestOptions<TInput = any> = RequestOptions<TInput>;

export type SubscriptionRequestOptions<
  TInput extends Record<string, any> = Record<string, any>
> = QueryRequestOptions<TInput>;

export type UploadRequestOptions = MutationRequestOptions<FileList> &
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
