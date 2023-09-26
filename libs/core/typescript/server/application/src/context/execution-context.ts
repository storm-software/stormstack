/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { DateTime } from "@stormstack/core-shared-utilities/common/date-time";
import { HttpMethod } from "@stormstack/core-shared-utilities/types";
import { GlobalContext } from "./global-context";
import { HeaderMap } from "./headers-map";

export type UserContext<TContext = any> = Record<string, any> &
  TContext & {
    id: string;
    name?: string;
    email?: string;
  };

export type RequestContext<TRequest = any> = TRequest & {
  requestId: string;
};

export interface HttpRequest<TBody = unknown> {
  /**
   * The HTTP method of the request.
   *
   * @remarks Value is capitalized
   * @example GET, POST, PATCH, DELETE
   */
  method: HttpMethod;

  /**
   * lowercase header name, multiple headers joined with ', '
   */
  headers: HeaderMap;

  /**
   * The URL of the Http request
   */
  url: URL;

  /**
   * The part of the URL after the question mark (not including the #fragment),
   * or the empty string if there is no question mark. Including the question
   * mark in this string is allowed but not required. Do not %-decode this
   * string. You can get this from a standard Node request with
   * `url.parse(request.url).search ?? ''`.
   */
  search: string;

  /**
   * read by your body-parser or whatever. we poke at it to make it into
   * the right real type.
   */
  body: TBody;
}

export type HttpRequestContext<TRequest extends HttpRequest = HttpRequest> =
  RequestContext<TRequest>;

export type ExecutionContext<
  TRequest extends HttpRequestContext = HttpRequestContext,
  TBindings = unknown,
  TUser extends UserContext<any> = UserContext<any>
> = {
  correlationId: string;
  user: TUser;
  request: TRequest;
  startedAt: DateTime;
  startedBy: string;
  bindings?: TBindings;
};

export type ServerContext<
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends ExecutionContext = ExecutionContext,
  TBindings = unknown
> = TGlobalContext & {
  execution: TExecutionContext;
  bindings?: TBindings;
};
