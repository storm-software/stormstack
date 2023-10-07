import { HeaderProxy } from "@stormstack/core-shared-api";
import { Injector } from "@stormstack/core-shared-injection";
import { Logger } from "@stormstack/core-shared-logging";
import { JsonParser, JsonValue } from "@stormstack/core-shared-serialization";
import { MaybePromise } from "@stormstack/core-shared-utilities";
import { ApiClientOptions } from "../client/api-client";
import { ApiClientRequest, ApiClientResult } from "../types";
import { ApiMiddleware } from "./api-middleware";

export class LoggingMiddleware extends ApiMiddleware {
  private readonly _logger: Logger;

  constructor(options: ApiClientOptions) {
    super(options);

    this._logger = Injector.get<Logger>(Logger);
  }

  public override async handle(
    options: ApiClientRequest,
    next: (options: ApiClientRequest) => MaybePromise<ApiClientResult>
  ): Promise<ApiClientResult> {
    this._logger.info(this.writeRequestLog(options));

    if (options.headers) {
      this._logger.debug(
        `Request Headers: ${this.writeHeadersLog(options.headers)}`
      );
    }
    if (options.body) {
      this._logger.debug(
        `Request Body: ${JsonParser.stringify(options.body as JsonValue)}`
      );
    }

    // Call next middleware
    const response = await Promise.resolve(next(options));

    this._logger.info(this.writeResponseLog(response));

    this._logger.debug(
      `Response Headers: ${this.writeHeadersLog(response.headers)}`
    );
    this._logger.debug(
      `Response Body: ${JsonParser.stringify(response.data as JsonValue)}`
    );

    return response;
  }

  protected writeRequestLog(request: ApiClientRequest): string {
    return `Sending Request ${
      request.method ? `(${request.method?.toUpperCase()})` : ""
    } - ${request.url}`;
  }

  protected writeResponseLog(response: ApiClientResult): string {
    return `Receiving Response - ${response.request.url}`;
  }

  protected writeHeadersLog(headers: HeaderProxy): string {
    const headersLog: string[] = [];
    for (const pair of headers.entries) {
      headersLog.push(`${pair[0]}: ${pair[1]}`);
    }

    return headersLog.join(", ");
  }
}
