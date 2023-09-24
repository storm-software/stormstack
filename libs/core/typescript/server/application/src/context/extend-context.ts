import { DateTime } from "@open-system/core-shared-utilities/common/date-time";
import { deepCopy } from "@open-system/core-shared-utilities/common/deep-copy";
import { isFunction } from "@open-system/core-shared-utilities/common/type-checks";
import {
  HttpMethod,
  MaybePromise
} from "@open-system/core-shared-utilities/types";
import { reduce } from "radash";
import {
  ExecutionContext,
  HttpRequest,
  ServerContext,
  UserContext
} from "./execution-context";
import { GlobalContext } from "./global-context";
import { HeaderMap } from "./headers-map";

export type ExtendServerContextFn<
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends ExecutionContext = ExecutionContext,
  TServerContext extends ServerContext<
    TGlobalContext,
    TExecutionContext
  > = ServerContext<TGlobalContext, TExecutionContext>
> = (
  context: TServerContext,
  execution: TExecutionContext
) => MaybePromise<TServerContext>;

export type CreateServerContextParams<
  TRequest extends HttpRequest = HttpRequest,
  TUser extends UserContext<any> = UserContext<any>,
  TGlobalContext extends GlobalContext = GlobalContext,
  TBindings = unknown
> = {
  globalContext: TGlobalContext;
  correlationId?: string;
  requestId?: string;
  request: TRequest;
  headers?: Record<string, string | string[] | undefined>;
  user: TUser;
  bindings?: TBindings;
};

export const createServerContext = async <
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends ExecutionContext = ExecutionContext,
  TServerContext extends ServerContext<
    TGlobalContext,
    TExecutionContext
  > = ServerContext<TGlobalContext, TExecutionContext>
>({
  globalContext,
  correlationId,
  requestId,
  request,
  headers: _headers = {},
  user,
  bindings
}: CreateServerContextParams): Promise<TServerContext> => {
  const uniqueIdGenerator = globalContext.utils.uniqueIdGenerator;
  const method = request.method.toUpperCase() as HttpMethod;

  const url = request.url
    ? new URL(request.url)
    : new URL(globalContext.system.info.url);
  const headers = _headers ? HeaderMap.normalize(_headers) : new HeaderMap();

  const context = {
    ...globalContext,
    bindings: bindings ?? globalContext.bindings,
    execution: {
      correlationId:
        correlationId ??
        headers.get("x-correlation-id") ??
        uniqueIdGenerator.generate(),
      user,
      request: {
        ...request,
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
    }
  } as TServerContext;

  context.utils.logger.debug("Execution Context Value: \n", context.execution);
  context.utils.logger.debug("Bindings Context Value: \n", context.bindings);
  context.utils.logger.debug("Server Context Value: \n", context);

  return context;
};

export const extendServerContext = async <
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends ExecutionContext = ExecutionContext,
  TServerContext extends ServerContext<
    TGlobalContext,
    TExecutionContext
  > = ServerContext<TGlobalContext, TExecutionContext>
>(
  globalContext: TGlobalContext,
  executionContext: TExecutionContext,
  handleExtendServerContext?:
    | ExtendServerContextFn<TGlobalContext, TExecutionContext, TServerContext>
    | Array<
        ExtendServerContextFn<TGlobalContext, TExecutionContext, TServerContext>
      >
): Promise<TServerContext> => {
  let extended = await createServerContext<
    TGlobalContext,
    TExecutionContext,
    TServerContext
  >({
    globalContext,
    request: executionContext.request,
    user: {
      id: "423424223211",
      name: "Pat Sullivan",
      email: "john.johnson@email.com"
    },
    bindings: executionContext?.bindings ?? globalContext?.bindings
  });

  if (handleExtendServerContext) {
    if (Array.isArray(handleExtendServerContext)) {
      extended = await Promise.resolve(
        reduce(
          handleExtendServerContext,
          async (
            ret: TServerContext,
            func: ExtendServerContextFn<
              TGlobalContext,
              TExecutionContext,
              TServerContext
            >
          ) =>
            runExtendServerContextFn<
              TGlobalContext,
              TExecutionContext,
              TServerContext
            >(func, ret, executionContext),
          extended
        )
      );
    } else {
      extended = await Promise.resolve(
        runExtendServerContextFn<
          TGlobalContext,
          TExecutionContext,
          TServerContext
        >(handleExtendServerContext, extended, executionContext)
      );
    }
  }

  return extended;
};

const runExtendServerContextFn = async <
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends ExecutionContext = ExecutionContext,
  TServerContext extends ServerContext<
    TGlobalContext,
    TExecutionContext
  > = ServerContext<TGlobalContext, TExecutionContext>
>(
  func: ExtendServerContextFn<
    TGlobalContext,
    TExecutionContext,
    TServerContext
  >,
  context: TServerContext,
  execution: TExecutionContext
): Promise<TServerContext> => {
  if (isFunction(func)) {
    context = await func(context, execution);
  }

  return context;
};

export const clearExecutionContext = <
  TGlobalContext extends GlobalContext = GlobalContext,
  TServerContext extends ServerContext<TGlobalContext> = ServerContext<TGlobalContext>
>(
  context: TServerContext
): TGlobalContext => {
  const result = deepCopy(context) as TGlobalContext & { execution?: any };
  delete result.execution;

  return result;
};
