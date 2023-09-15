/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { DateTime } from "@open-system/core-shared-utilities/common/date-time";
import { HttpMethod } from "@open-system/core-shared-utilities/types";
import { HeaderMap } from "./headers-map";
import { InitialServerContext } from "./initial-context";

export type UserContext<TContext = any> = Record<string, any> &
  TContext & {
    id: string;
    name?: string;
    email?: string;
  };

export type RequestContext<TRequest = any> = TRequest & {
  requestId: string;
  startedAt: DateTime;
  startedBy: string;
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

export type ActiveContext<
  TRequest extends HttpRequest = HttpRequest,
  TUser extends UserContext<any> = UserContext<any>
> = {
  correlationId: string;
  user: TUser;
  request: HttpRequestContext;
  startedAt: DateTime;
  startedBy: string;
};

export type ActiveServerContext = ActiveContext<HttpRequest, UserContext>;

export type ServerContext<
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends ActiveServerContext = ActiveServerContext,
  TBindings = unknown
> = TInitialContext & {
  active: TActiveContext;
  bindings?: TBindings;
};

export type ExtendServerContextParams<
  TRequest extends HttpRequest = HttpRequest,
  TUser extends UserContext<any> = UserContext<any>,
  TInitialContext extends InitialServerContext = InitialServerContext,
  TBindings = unknown
> = {
  initialContext: TInitialContext;
  correlationId?: string;
  requestId?: string;
  request: TRequest;
  headers?: Record<string, string | string[] | undefined>;
  user: TUser;
  bindings?: TBindings;
};

export const extendServerContext = async <
  TRequest extends HttpRequest = HttpRequest,
  TUser extends UserContext<any> = UserContext<any>,
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends ActiveContext<TRequest, TUser> = ActiveContext<
    TRequest,
    TUser
  >,
  TBindings = unknown
>({
  initialContext,
  correlationId,
  requestId,
  request,
  headers = {},
  user,
  bindings
}: ExtendServerContextParams<
  TRequest,
  TUser,
  TInitialContext,
  TBindings
>): Promise<ServerContext<TInitialContext, TActiveContext>> => {
  const uniqueIdGenerator = initialContext.utils.uniqueIdGenerator;
  const method = request.method.toUpperCase();

  const url = request.url
    ? new URL(request.url)
    : initialContext.system.info.url;

  return {
    ...initialContext,
    bindings: bindings ?? initialContext.bindings,
    active: {
      correlationId: correlationId ?? uniqueIdGenerator.generate(),
      user,
      request: {
        requestId: requestId ?? uniqueIdGenerator.generate(),
        method,
        headers: headers ? HeaderMap.normalize(headers) : new HeaderMap(),
        url,
        body:
          request instanceof Request
            ? method === "GET"
              ? request.body
              : await request.json()
            : {},
        search: url.search ?? ""
      },
      startedAt: DateTime.current,
      startedBy: (user as UserContext<any>)?.id
    } as TActiveContext
  };
};
