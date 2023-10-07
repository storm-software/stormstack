import { ClientBaseEnvManager } from "@stormstack/core-client-env";
import {
  ApiErrorCode,
  HeaderTypes,
  MediaTypes
} from "@stormstack/core-shared-api";
import { Injector } from "@stormstack/core-shared-injection";
import { Logger } from "@stormstack/core-shared-logging";
import {
  BaseError,
  MaybePromise,
  isRuntimeServer,
  isSet,
  isString
} from "@stormstack/core-shared-utilities";
import { ApiClientOptions } from "../client/api-client";
import { ApiClientRequest, ApiClientResult } from "../types";
import { handleFetch } from "../utilities/fetch";
import { ApiMiddleware } from "./api-middleware";

export class CsrfMiddleware extends ApiMiddleware {
  private readonly _logger: Logger;
  private readonly _env: ClientBaseEnvManager;
  private _csrfToken?: string;
  private _csrfEnabled: boolean = true;

  constructor(options: ApiClientOptions) {
    super(options);

    this._logger = Injector.get<Logger>(Logger);
    this._env = Injector.get<ClientBaseEnvManager>(ClientBaseEnvManager);

    this._csrfEnabled = isSet(this.options.csrfEnabled)
      ? this.options.csrfEnabled
      : this._env.csrfEnabled;
  }

  public override async handle(
    options: ApiClientRequest,
    next: (options: ApiClientRequest) => MaybePromise<ApiClientResult>
  ): Promise<ApiClientResult> {
    if (this.shouldIncludeCsrfToken(options)) {
      this._logger.debug("CSRF token required for request");
      const csrfToken = await this.getCsrfToken(options);
      if (csrfToken) {
        this._logger.debug("Adding CSRF token to request headers");
        options.headers.set(HeaderTypes.X_CSRF_TOKEN, csrfToken);
      }
    }

    // Call next middleware
    return next(options);
  }

  private async getCsrfToken(options: ApiClientRequest): Promise<string> {
    // request a new CSRF token if we don't have one
    if (!this._csrfToken) {
      const res = await handleFetch({
        ...this.options,
        url: this.options.csrfTokenUrl
          ? this.options.csrfTokenUrl
          : `${
              isString(options.url)
                ? new URL(options.url).origin
                : options.url.origin
            }/api/auth/csrf`,
        headers: {
          ...options.headers,
          [HeaderTypes.ACCEPT]: MediaTypes.TEXT_PLAIN
        }
      });

      this._csrfToken = await res.text();
      if (!this._csrfToken) {
        throw new BaseError(
          ApiErrorCode.csrf_token_missing,
          "Failed to get CSRF token. Please make sure you are authenticated."
        );
      }
    }

    return this._csrfToken;
  }

  private shouldIncludeCsrfToken(options: ApiClientRequest) {
    if (this._csrfEnabled) {
      if (options.requireAuth) {
        return true;
      }

      if (options.headers.has(HeaderTypes.AUTHORIZATION)) {
        return options.headers[HeaderTypes.AUTHORIZATION];
      }

      // If fetchUser has never been called and we're in a browser
      // assume we do need the CSRF token. This shouldn't be a problem
      // because the CSRF token generator is always available
      if (isRuntimeServer()) {
        // Browser
        return true;
      }

      // Backend
      return false;
    }

    return false;
  }
}
