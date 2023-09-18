import { IEntity } from "@open-system/core-server-domain/types";
import { Service } from "../services";
import {
  ExecutionServerContext,
  HttpRequest,
  HttpRequestContext,
  RequestContext,
  ServerContext
} from "./context";
import {
  GlobalServerContext,
  ServiceMappingIndex,
  UtilityContext
} from "./global-context";

export const extractExecution = (
  context: ServerContext<GlobalServerContext, ExecutionServerContext>
): ExecutionServerContext => context?.execution;

export const extractRequest = <TRequest extends HttpRequest = HttpRequest>(
  context: ServerContext<GlobalServerContext, ExecutionServerContext>
): HttpRequestContext<TRequest> =>
  extractExecution(context)?.request as HttpRequestContext<TRequest>;

export const extractCorrelationId = (
  context: ServerContext<GlobalServerContext, ExecutionServerContext>
): ExecutionServerContext["correlationId"] =>
  extractExecution(context)
    ?.correlationId as ExecutionServerContext["correlationId"];

export const extractRequestId = <TRequest extends HttpRequest = HttpRequest>(
  context: ServerContext<GlobalServerContext, ExecutionServerContext>
): RequestContext<TRequest>["requestId"] =>
  extractRequest<TRequest>(context)
    ?.requestId as RequestContext<TRequest>["requestId"];

export const extractRequestHeaders = <
  TRequest extends HttpRequest = HttpRequest
>(
  context: ServerContext<GlobalServerContext, ExecutionServerContext>
): RequestContext<TRequest>["headers"] =>
  extractRequest<TRequest>(context)?.headers;

export const extractLogger = (context: GlobalServerContext) =>
  context?.utils?.logger;

export const extractUser = (
  context: ServerContext<GlobalServerContext, ExecutionServerContext>
): ExecutionServerContext["user"] => context?.execution?.user;

export const extractUserId = (
  context: ServerContext<GlobalServerContext, ExecutionServerContext>
): string => extractUser(context)?.id;

export const extractSystem = (context: GlobalServerContext) => context?.system;

export const extractSystemInfo = (context: GlobalServerContext) =>
  context?.system?.info;

export const extractEnv = (context: GlobalServerContext) => context?.env;

export const extractService = <
  TEntity extends IEntity = IEntity,
  TUtils extends UtilityContext = UtilityContext
>(
  context: GlobalServerContext<Array<TEntity>, TUtils>,
  entityName: ServiceMappingIndex<TEntity>
): Service<TEntity> => context?.services?.[entityName] as Service<TEntity>;
