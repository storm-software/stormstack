import { Repeater } from "@repeaterjs/repeater";
import { ClientBaseEnvManager } from "@stormstack/core-client-env";
import {
  ApiErrorCode,
  HeaderProxy,
  HeaderTypes,
  HttpMethods,
  HttpStatusCode,
  MediaTypes,
  createApiHeadersProxy
} from "@stormstack/core-shared-api";
import { Injector } from "@stormstack/core-shared-injection";
import {
  JsonParser,
  QueryParamsParser
} from "@stormstack/core-shared-serialization";
import {
  BaseErrorCode,
  BaseUtilityClass,
  DateTime,
  ProcessingError,
  StormError
} from "@stormstack/core-shared-utilities";
import { ApiMiddleware } from "../middleware";
import { ApiMiddlewareStack } from "../middleware/api-middleware-stack";
import {
  API_CLIENT_SYMBOL,
  ApiClientRequest,
  ApiClientResult,
  ApiClientResultStatus,
  MutationRequestOptions,
  QueryRequestOptions,
  SubscriptionRequestOptions,
  UploadRequestOptions,
  UploadResponse,
  UploadValidationOptions
} from "../types";
import { deserializeResult } from "../utilities";

export interface ApiClientOptions extends UploadValidationOptions {
  applicationHash?: string;
  baseUrl?: string;

  sdkVersion?: string;
  extraHeaders?: Headers;
  csrfEnabled?: boolean;
  csrfTokenUrl?: string;

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

export class ApiClient extends BaseUtilityClass {
  protected readonly headerProxy: HeaderProxy;
  protected readonly csrfEnabled: boolean = true;
  protected csrfToken?: string;
  protected middlewareStack: ApiMiddlewareStack;
  protected env: ClientBaseEnvManager;

  /**
   * A string representing the base class
   *
   * @remarks This is used when determining how to deserialize the object
   */
  public override get __base(): string {
    return "ApiClient";
  }

  constructor(protected options: ApiClientOptions = {}) {
    super(API_CLIENT_SYMBOL);
    this.env = Injector.get(ClientBaseEnvManager);

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

    this.headerProxy = createApiHeadersProxy(headers);

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
    this.headerProxy.set(HeaderTypes.AUTHORIZATION, `Bearer ${token}`);
  }

  /**
   * unsetAuthorization removes any previously set authorization credentials
   * (e.g. via setAuthorizationToken or via setExtraHeaders).
   * If there was no authorization set, it does nothing.
   */
  public unsetAuthorizationToken() {
    this.headerProxy.delete(HeaderTypes.AUTHORIZATION);
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
   * Set up subscriptions over SSE with fallback to web streams.
   *
   * Falls back to web streams if extraHeaders are set,
   * no callback is supplied or EventSource is not supported.
   *
   * When called with subscribeOnce it will return the response directly
   * without setting up a subscription.
   * @see https://docs.wundergraph.com/docs/architecture/wundergraph-rpc-protocol-explained#subscriptions
   */
  public subscribe<
    TRequestOptions extends SubscriptionRequestOptions,
    TData = any,
    TError extends StormError = StormError
  >(options: TRequestOptions) {
    return new Repeater(async (push, end) => {
      return this.startEventSource<TData, TError>(options, push, end);
    });
  }

  protected async *startEventSource<
    TData = any,
    TError extends StormError = StormError
  >(
    subscription: SubscriptionRequestOptions,
    push: (data: ApiClientResult<TData, TError>) => void,
    end: (error?: TError) => void
  ): AsyncGenerator<ApiClientResult<TData, TError>> {
    if (!("EventSource" in globalThis)) {
      throw new ProcessingError("EventSource is not supported in this browser");
    }

    const url = new URL(
      (subscription.url ? subscription.url : this.baseUrl()).toString()
    );
    url.search = QueryParamsParser.stringify(subscription.input);

    const requestAt = DateTime.current;
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
      if (ev.data === "done" || eventSource.readyState === 2) {
        end();
        return;
      }
      if (ev.data == "") {
        return;
      }

      const jsonResp = deserializeResult<TData, TError>({
        data: ev.data,
        status: ApiClientResultStatus.SUCCESS,
        headers: createApiHeadersProxy(new Headers()),
        requestAt,
        responseAt: DateTime.current,
        request: subscription,
        httpStatusCode: HttpStatusCode.OK_200
      });

      push(jsonResp);
    });

    if (subscription.signal) {
      subscription.signal.addEventListener("abort", () => eventSource.close());
    }

    await end;
    eventSource.close();
  }

  public async fetch<TData = any, TError extends StormError = StormError>(
    options: Partial<ApiClientRequest>
  ): Promise<ApiClientResult<TData, TError>> {
    let headers!: HeaderProxy;
    if (!options.headers) {
      headers = createApiHeadersProxy(this.headerProxy.headers);
    } else {
      headers.merge(this.headerProxy);
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

  public validateFiles(options: UploadRequestOptions) {}

  protected baseUrl(): string {
    return this.options.baseUrl
      ? this.options.baseUrl
      : this.env.baseUrl.pathname
      ? `${this.env.baseUrl.origin}/${this.env.baseUrl.pathname}`
      : this.env.baseUrl.origin;
  }

  protected addUrlParams(url: string, queryParams: URLSearchParams): string {
    queryParams.sort();
    const queryString = this.encodeQueryParams(queryParams);

    return url + (queryString ? `?${queryString}` : "");
  }

  protected encodeQueryParams(queryParams: URLSearchParams): string {
    const originalString = queryParams.toString();
    const withoutEmptyArgs = originalString.replace("=&", "&");
    return withoutEmptyArgs.endsWith("=")
      ? withoutEmptyArgs.slice(0, -1)
      : withoutEmptyArgs;
  }

  protected stringifyInput(input: any) {
    const encoded = JsonParser.stringify(input || {});
    return encoded === "{}" ? undefined : encoded;
  }

  /**
   * Handles authentication errors from a failed attempt in a browser context
   * by examining window.location.href
   */
  private handleAuthenticationError() {
    if (typeof window !== "undefined") {
      const href = window.location.href;
      const sep = href.indexOf("?");
      const query = href.substring(sep);
      const searchParams = new URLSearchParams(query);
      const errorCode = searchParams.get("_wg.auth.error.code");
      const errorMessage = searchParams.get("_wg.auth.error.message");
      if (errorCode || errorMessage) {
        searchParams.delete("_wg.auth.error.code");
        searchParams.delete("_wg.auth.error.message");
        const newQuery = searchParams.toString();
        const nonQuery = href.substring(0, sep);
        let nextUrl: string;
        if (newQuery) {
          nextUrl = `${nonQuery}?${newQuery}`;
        } else {
          nextUrl = nonQuery;
        }

        const code = decodeURIComponent(errorCode || "") as BaseErrorCode;
        const message = decodeURIComponent(errorMessage || errorCode || "");
        window.history.replaceState({}, window.document.title, nextUrl);

        throw new StormError(code, message);
      }
    }
  }

  /*private isAuthenticatedOperation(operationName: string) {
    return !!this.options.operationMetadata?.[operationName]
      ?.requiresAuthentication;
  }*/
}
