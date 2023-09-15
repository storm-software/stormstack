import { IEntity } from "@open-system/core-server-domain/types";
import { Service } from "../services";
import {
  ActiveServerContext,
  HttpRequest,
  HttpRequestContext,
  RequestContext,
  ServerContext
} from "./context";
import {
  InitialServerContext,
  ServiceMappingIndex,
  UtilityContext
} from "./initial-context";

export const extractActive = (
  context: ServerContext<InitialServerContext, ActiveServerContext>
): ActiveServerContext => context?.active;

export const extractRequest = <TRequest extends HttpRequest = HttpRequest>(
  context: ServerContext<InitialServerContext, ActiveServerContext>
): HttpRequestContext<TRequest> =>
  extractActive(context)?.request as HttpRequestContext<TRequest>;

export const extractCorrelationId = (
  context: ServerContext<InitialServerContext, ActiveServerContext>
): ActiveServerContext["correlationId"] =>
  extractActive(context)?.correlationId as ActiveServerContext["correlationId"];

export const extractRequestId = <TRequest extends HttpRequest = HttpRequest>(
  context: ServerContext<InitialServerContext, ActiveServerContext>
): RequestContext<TRequest>["requestId"] =>
  extractRequest<TRequest>(context)
    ?.requestId as RequestContext<TRequest>["requestId"];

export const extractRequestHeaders = <
  TRequest extends HttpRequest = HttpRequest
>(
  context: ServerContext<InitialServerContext, ActiveServerContext>
): RequestContext<TRequest>["headers"] =>
  extractRequest<TRequest>(context)?.headers;

export const extractLogger = (context: InitialServerContext) =>
  context?.utils?.logger;

export const extractUser = (
  context: ServerContext<InitialServerContext, ActiveServerContext>
): ActiveServerContext["user"] => context?.active?.user;

export const extractUserId = (
  context: ServerContext<InitialServerContext, ActiveServerContext>
): string => extractUser(context)?.id;

export const extractSystem = (context: InitialServerContext) => context?.system;

export const extractSystemInfo = (context: InitialServerContext) =>
  context?.system?.info;

export const extractEnv = (context: InitialServerContext) => context?.env;

export const extractService = <
  TEntity extends IEntity = IEntity,
  TUtils extends UtilityContext = UtilityContext
>(
  context: InitialServerContext<Array<TEntity>, TUtils>,
  entityName: ServiceMappingIndex<TEntity>
): Service<TEntity> => context?.services?.[entityName] as Service<TEntity>;
