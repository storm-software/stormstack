/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  ExecutionContext,
  ExtendServerContextFn,
  GlobalContext,
  HttpRequest,
  HttpRequestContext,
  ServerContext,
  UserContext
} from "@open-system/core-server-application/context";
import { IEntity } from "@open-system/core-server-domain/types";
import { MaybePromise } from "@open-system/core-shared-utilities";
import { GraphQLParams, YogaInitialContext } from "graphql-yoga";

export type GraphQLRequest<TVariables = any> = HttpRequest<
  GraphQLParams<TVariables>
> & {
  params: GraphQLParams<TVariables>;
};

export type GraphQLRequestContext<TVariables = any> = HttpRequestContext<
  GraphQLRequest<GraphQLParams<TVariables>>
> & {
  params: GraphQLParams<TVariables>;
};

export type GraphQLExecutionContext<
  TVariables = any,
  TRequest extends GraphQLRequestContext<TVariables> = GraphQLRequestContext<TVariables>,
  TUser extends UserContext<any> = UserContext<any>
> = ExecutionContext<TRequest, TUser> & {
  operationName: string;
};

export type GraphQLServerContext<
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends GraphQLExecutionContext = GraphQLExecutionContext,
  TBindings = unknown
> = ServerContext<TGlobalContext, TExecutionContext> & {
  execution: GraphQLExecutionContext;
  bindings?: TBindings;
} & YogaInitialContext;

export const extractExecution = (
  context: GraphQLServerContext<
    GlobalContext<Array<IEntity>>,
    GraphQLExecutionContext
  >
) => context?.execution as GraphQLExecutionContext;

export const extractGraphQLRequest = (
  context: GraphQLServerContext<
    GlobalContext<Array<IEntity>>,
    GraphQLExecutionContext
  >
): GraphQLExecutionContext["request"] => extractExecution(context)?.request;

export const extractOperationName = (
  context: GraphQLServerContext<
    GlobalContext<Array<IEntity>>,
    GraphQLExecutionContext
  >
): GraphQLExecutionContext["operationName"] =>
  extractExecution(context)?.operationName;

export const extendGraphQLServerContext: ExtendServerContextFn<
  GlobalContext,
  GraphQLExecutionContext,
  GraphQLServerContext<GlobalContext, GraphQLExecutionContext>
> = (
  serverContext: GraphQLServerContext,
  executionContext: GraphQLExecutionContext
): MaybePromise<
  GraphQLServerContext<GlobalContext, GraphQLExecutionContext>
> => {
  const graphQLServerContext = serverContext as GraphQLServerContext;

  graphQLServerContext.execution.operationName =
    executionContext.operationName ?? "unknown";
  graphQLServerContext.execution.request.body = executionContext.request.params;

  return graphQLServerContext;
};
