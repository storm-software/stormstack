import { Repeater } from "@repeaterjs/repeater";
import { ClientBaseEnvManager } from "@stormstack/core-client-env";
import {
  ApiClientResult,
  ApiClientResultStatus,
  ApiErrorCode,
  HeaderTypes,
  HeadersProxy,
  HttpMethods,
  applyLiveQueryJSONDiffPatch,
  createApiHeadersProxy
} from "@stormstack/core-shared-api";
import { QueryParamsParser } from "@stormstack/core-shared-serialization";
import { MediaTypes } from "@stormstack/core-shared-state";
import {
  BaseUtilityClass,
  ProcessingError,
  StormError
} from "@stormstack/core-shared-utilities";
import { ApiMiddleware } from "../middleware";
import { ApiMiddlewareStack } from "../middleware/api-middleware-stack";
import {
  API_CLIENT_SYMBOL,
  ApiClientRequest,
  MutationRequestOptions,
  QueryRequestOptions,
  SubscriptionRequestOptions,
  SubscriptionToRequestOptions,
  UploadRequestOptions,
  UploadResponse,
  UploadValidationOptions
} from "../types";
import { deserializeResult } from "../utilities";

/**
 * ApiClientOptions is used to configure the ApiClient.
 */
export interface ApiClientOptions extends UploadValidationOptions {
  /**
   * The base URL of the API server.
   *
   * @remarks This is used to construct the full URL for each API request.
   */
  baseUrl?: string;

  /**
   * The current SDK version of Storm running.
   */
  sdkVersion?: string;

  /**
   * Extra headers to be sent with each request.
   */
  extraHeaders?: Headers;

  /**
   * Is CSRF token required for this client?
   */
  csrfEnabled?: boolean;

  /**
   * How many times should the client try to reconnect before it errors out?
   *
   * @default 5
   */
  retryAttempts?: number;

  /**
   * Specifies the number of milliseconds before the request times out.
   * default is `0` (no timeout)
   */
  timeoutMs?: number;

  /**
   * Middleware to be used by the client.
   * Middleware is executed in the order they are defined.
   */
  middleware?: Array<new (options: ApiClientOptions) => ApiMiddleware>;
}

/**
 * ApiClient is a base class including various methods for making requests to the API server.
 */
export class ApiClient extends BaseUtilityClass {
  protected readonly headersProxy: HeadersProxy;
  protected readonly csrfEnabled: boolean = true;

  protected middlewareStack: ApiMiddlewareStack;
  protected csrfToken?: string;

  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public override get __base(): string {
    return "ApiClient";
  }

  constructor(
    protected env: ClientBaseEnvManager,
    protected options: ApiClientOptions = {}
  ) {
    super(API_CLIENT_SYMBOL);

    const headers = new Headers();
    if (this.options.extraHeaders) {
      for (const [key, value] of this.options.extraHeaders.entries()) {
        headers.set(key, value);
      }
    }
    if (this.options.sdkVersion || this.env.sdkVersion) {
      headers.set(
        HeaderTypes.STORM_SDK_VERSION,
        this.options.sdkVersion || this.env.sdkVersion
      );
    }

    this.headersProxy = createApiHeadersProxy(headers);

    this.middlewareStack = new ApiMiddlewareStack();
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
  }

  /**
   * setAuthorizationToken is a shorthand method for setting up the
   * required headers for token authentication.
   *
   * @param token Bearer token
   */
  public setAuthorizationToken(token: string) {
    this.headersProxy.set(HeaderTypes.AUTHORIZATION, `Bearer ${token}`);
  }

  /**
   * unsetAuthorization removes any previously set authorization credentials
   * (e.g. via setAuthorizationToken or via setExtraHeaders).
   * If there was no authorization set, it does nothing.
   */
  public unsetAuthorizationToken() {
    this.headersProxy.delete(HeaderTypes.AUTHORIZATION);
  }

  /**
   * Query makes a GET request to the server.
   *
   * @remarks The method only throws an error if the request fails to reach the server or the server returns a non-200 status code. Application errors are returned as part of the response.
   * @param options The request options
   * @returns The response from the server
   */
  public async query<
    TOptions extends QueryRequestOptions,
    TData = any,
    TError extends StormError = StormError
  >(options: TOptions): Promise<ApiClientResult<TData, TError>> {
    return await this.fetch({
      method: HttpMethods.GET,
      body: options.input,
      ...options
    });
  }

  /**
   * Mutate makes a POST request to the server.
   *
   * @remarks The method only throws an error if the request fails to reach the server or the server returns a non-200 status code. Application errors are returned as part of the response.
   * @param options The request options
   * @returns The response from the server
   */
  public async mutate<
    RequestOptions extends MutationRequestOptions,
    TData = any,
    TError extends StormError = StormError
  >(options: RequestOptions): Promise<ApiClientResult<TData, TError>> {
    return await this.fetch({
      method: HttpMethods.POST,
      ...options,
      body: options.input,
      headers: {
        [HeaderTypes.CONTENT_TYPE]: MediaTypes.JSON,
        [HeaderTypes.ACCEPT]: MediaTypes.JSON,
        ...options.headers
      }
    });
  }

  /**
   * Subscribe makes a GET request to the server and returns a Repeater that emits the response from the server.
   *
   * @param options The request options
   * @returns
   */
  public subscribe<
    TRequestOptions extends SubscriptionRequestOptions,
    TData = any,
    TError extends StormError = StormError
  >(options: TRequestOptions) {
    return new Repeater<ApiClientResult<TData, TError>>(async (push, end) => {
      if (options.subscribeOnce) {
        const result = await this.query<TRequestOptions, TData, TError>(
          options
        );

        push?.(result);
        end();

        return;
      }

      if (!("EventSource" in globalThis)) {
        throw new ProcessingError(
          "EventSource is not supported in this browser"
        );
      }

      const url = new URL(
        (options.url ? options.url : this.baseUrl()).toString()
      );
      url.search = QueryParamsParser.stringify(options.input);

      const eventSource = new EventSource(url, {
        withCredentials: true
      });

      eventSource.addEventListener("error", () => {
        end(
          new StormError(
            ApiErrorCode.subscription_error,
            `An error occured while receiving Server Sent Events`
          ) as TError
        );
      });

      eventSource.addEventListener("message", ev => {
        if (
          ev.data === "done" ||
          eventSource.readyState === EventSource.CLOSED
        ) {
          end();
          return;
        }
        if (ev.data == "") {
          return;
        }

        const jsonResp = deserializeResult<TData, TError>({
          data: ev.data,
          status: ApiClientResultStatus.SUCCESS
        });

        push(jsonResp);
      });

      if (options.signal) {
        options.signal.addEventListener("abort", () => eventSource.close());
      }

      await end;
      eventSource.close();
    });
  }

  /**
   * Subscribe makes a GET request to the server and returns a Repeater that emits the response from the server.
   *
   * @param options The request options
   * @returns
   */
  public async subscribeTo<
    TRequestOptions extends SubscriptionToRequestOptions,
    TData = any,
    TError extends StormError = StormError
  >(options: TRequestOptions) {
    const result = applyLiveQueryJSONDiffPatch<ApiClientResult<TData, TError>>(
      this.subscribe<TRequestOptions, TData, TError>(options)
    );

    for await (const value of result) {
      options.onResult(value);
    }
  }

  /**
   * Uploads one or more files to the server. Authentication is required. The method throws an error if the files could not be uploaded for any reason. If the upload was successful, your return a list of file IDs that can be used to download the files from your S3 bucket.
   *
   * @param config
   * @param validation
   * @returns
   */
  public async upload(
    options: UploadRequestOptions
  ): Promise<ApiClientResult<UploadResponse>> {
    // Handle upload validations first
    const maxAllowedFiles =
      options?.maxAllowedFiles ?? this.options?.maxAllowedFiles;

    if (maxAllowedFiles && options.input.length > maxAllowedFiles) {
      throw new ProcessingError(
        `uploading ${options.input.length} exceeds the maximum allowed (${maxAllowedFiles})`
      );
    }

    const maxAllowedUploadSizeBytes =
      options?.maxAllowedUploadSizeBytes ??
      this.options?.maxAllowedUploadSizeBytes;
    const allowedFileExtensions =
      options?.allowedFileExtensions ?? this.options?.allowedFileExtensions;
    const allowedMimeTypes =
      options?.allowedMimeTypes ?? this.options?.allowedMimeTypes;

    for (const file of options.input) {
      if (maxAllowedUploadSizeBytes && file.size > maxAllowedUploadSizeBytes) {
        throw new ProcessingError(
          `file ${file.name} with size ${file.size} exceeds the maximum allowed (${maxAllowedUploadSizeBytes})`
        );
      }

      if (allowedFileExtensions && file.name.includes(".")) {
        const ext = file.name
          .substring(file.name.indexOf(".") + 1)
          .toLowerCase();
        if (ext) {
          if (
            allowedFileExtensions.findIndex((item: string) =>
              item.toLocaleLowerCase()
            ) < 0
          ) {
            throw new ProcessingError(
              `file ${file.name} with extension ${ext} is not allowed`
            );
          }
        }
      }

      if (allowedMimeTypes) {
        const mimeType = file.type;
        const idx = allowedMimeTypes.findIndex((item: string) => {
          // Full match
          if (item == mimeType) {
            return true;
          }
          // Try wildcard match. This is a bit brittle but it should be fine
          // as long as profile?.allowedMimeTypes contains only valid entries
          return mimeType.match(new RegExp(item.replace("*", ".*")));
        });
        if (idx < 0) {
          throw new ProcessingError(
            `file ${file.name} with MIME type ${mimeType} is not allowed`
          );
        }
      }
    }

    // Handle upload request second
    const formData = new FormData();
    for (const [_, file] of Object.entries(options.input)) {
      if (file instanceof Blob) {
        formData.append("files", file);
      }
    }

    const result = await this.fetch({
      ...options,
      url: options.url ? options.url : `${this.baseUrl()}/api/s3/upload`,
      body: formData,
      method: HttpMethods.POST
    });

    const json = result.data as { key: string }[];
    return {
      ...result,
      data: {
        fileKeys: json.map(x => x.key)
      }
    };
  }

  /**
   * Fetch makes a request to the server.
   *
   * @param options The request options
   * @returns
   */
  protected async fetch<TData = any, TError extends StormError = StormError>(
    options: Partial<ApiClientRequest>
  ): Promise<ApiClientResult<TData, TError>> {
    let headers!: HeadersProxy;
    if (!options.headers) {
      headers = createApiHeadersProxy(this.headersProxy.headers);
    } else {
      headers.merge(this.headersProxy);
    }

    const response = await this.middlewareStack.run<
      ApiClientResult<TData, TError>
    >({
      url: this.baseUrl(),
      ...options,
      headers
    });

    return response;
  }

  /**
   * The base URL of the API server.
   *
   * @remarks This is used to construct the full URL for each API request.
   */
  protected baseUrl(): string {
    return this.options.baseUrl
      ? this.options.baseUrl
      : this.env.baseUrl.pathname
      ? `${this.env.baseUrl.origin}/${this.env.baseUrl.pathname}`
      : this.env.baseUrl.origin;
  }
}
