import { IEntity } from "@stormstack/core-server-domain/types";
import { Service } from "../services";
import {
  ExecutionContext,
  HttpRequest,
  RequestContext,
  ServerContext
} from "./execution-context";
import {
  GlobalContext,
  ServiceMappingIndex,
  UtilityContext
} from "./global-context";

export const extractExecution = (
  context: ServerContext<GlobalContext, ExecutionContext>
): ExecutionContext => context?.execution;

export const extractRequest = <TRequest extends HttpRequest = HttpRequest>(
  context: ServerContext<GlobalContext, ExecutionContext>
): RequestContext<TRequest> =>
  extractExecution(context)?.request as RequestContext<TRequest>;

export const extractCorrelationId = (
  context: ServerContext<GlobalContext, ExecutionContext>
): ExecutionContext["correlationId"] =>
  extractExecution(context)?.correlationId as ExecutionContext["correlationId"];

export const extractRequestId = <TRequest extends HttpRequest = HttpRequest>(
  context: ServerContext<GlobalContext, ExecutionContext>
): RequestContext<TRequest>["requestId"] =>
  extractRequest<TRequest>(context)
    ?.requestId as RequestContext<TRequest>["requestId"];

export const extractRequestHeaders = <
  TRequest extends HttpRequest = HttpRequest
>(
  context: ServerContext<GlobalContext, ExecutionContext>
): RequestContext<TRequest>["headers"] =>
  extractRequest<TRequest>(context)?.headers;

export const extractLogger = (context: GlobalContext) => context?.utils?.logger;

export const extractUser = (
  context: ServerContext<GlobalContext, ExecutionContext>
): ExecutionContext["user"] => context?.execution?.user;

export const extractUserId = (
  context: ServerContext<GlobalContext, ExecutionContext>
): string => extractUser(context)?.id;

export const extractSystem = (context: GlobalContext) => context?.system;

export const extractSystemInfo = (context: GlobalContext) =>
  context?.system?.info;

export const extractEnv = (context: GlobalContext) => context?.env;

export const extractService = <
  TEntity extends IEntity = IEntity,
  TUtils extends UtilityContext = UtilityContext
>(
  context: GlobalContext<Array<TEntity>, TUtils>,
  entityName: ServiceMappingIndex<TEntity>
): Service<TEntity> => context?.services?.[entityName] as Service<TEntity>;
