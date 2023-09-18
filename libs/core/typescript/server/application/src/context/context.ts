/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { DateTime } from "@open-system/core-shared-utilities/common/date-time";
import { HttpMethod } from "@open-system/core-shared-utilities/types";
import { GlobalServerContext } from "./global-context";
import { HeaderMap } from "./headers-map";

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

export type ExecutionContext<
  TRequest extends HttpRequest = HttpRequest,
  TUser extends UserContext<any> = UserContext<any>
> = {
  correlationId: string;
  user: TUser;
  request: HttpRequestContext;
  startedAt: DateTime;
  startedBy: string;
};

export type ExecutionServerContext = ExecutionContext<HttpRequest, UserContext>;

export type ServerContext<
  TInitialContext extends GlobalServerContext = GlobalServerContext,
  TExecutionContext extends ExecutionServerContext = ExecutionServerContext,
  TBindings = unknown
> = TInitialContext & {
  execution: TExecutionContext;
  bindings?: TBindings;
};

export type ExtendServerContextParams<
  TRequest extends HttpRequest = HttpRequest,
  TUser extends UserContext<any> = UserContext<any>,
  TInitialContext extends GlobalServerContext = GlobalServerContext,
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
  TGlobalContext extends GlobalServerContext = GlobalServerContext,
  TExecutionContext extends ExecutionContext<
    TRequest,
    TUser
  > = ExecutionContext<TRequest, TUser>,
  TBindings = unknown
>({
  initialContext,
  correlationId,
  requestId,
  request,
  headers: _headers = {},
  user,
  bindings
}: ExtendServerContextParams<
  TRequest,
  TUser,
  TGlobalContext,
  TBindings
>): Promise<ServerContext<TGlobalContext, TExecutionContext>> => {
  const uniqueIdGenerator = initialContext.utils.uniqueIdGenerator;
  const method = request.method.toUpperCase();

  const url = request.url
    ? new URL(request.url)
    : new URL(initialContext.system.info.url);
  const headers = _headers ? HeaderMap.normalize(_headers) : new HeaderMap();

  const context = {
    ...initialContext,
    bindings: bindings ?? initialContext.bindings,
    execution: {
      correlationId:
        correlationId ??
        headers.get("x-correlation-id") ??
        uniqueIdGenerator.generate(),
      user,
      request: {
        requestId:
          requestId ??
          headers.get("x-request-id") ??
          uniqueIdGenerator.generate(),
        method,
        headers,
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
    } as TExecutionContext
  };

  context.utils.logger.debug("Execution Context Value: \n", context);

  return context;
};

export const clearExecutionContext = <
  TGlobalContext extends GlobalServerContext = GlobalServerContext
>(
  context: TGlobalContext & { execution?: Pick<ServerContext, "execution"> }
): TGlobalContext => {
  delete context.execution;
  return context;
};
