/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  ExecutionContext,
  GlobalServerContext,
  HttpRequest,
  ServerContext,
  UserContext
} from "@open-system/core-server-application/context";
import { IEntity } from "@open-system/core-server-domain/types";
import { GraphQLParams, YogaInitialContext } from "graphql-yoga";

export type GraphQLRequest<TVariables = any> = HttpRequest<
  GraphQLParams<TVariables>
>;

export type GraphQLExecutionContext<
  TVariables = any,
  TRequest extends GraphQLRequest<TVariables> = GraphQLRequest<TVariables>,
  TUser extends UserContext<any> = UserContext<any>
> = ExecutionContext<TRequest, TUser> & {
  operationName: string;
};

export type GraphQLExecutionServerContext = GraphQLExecutionContext<
  any,
  GraphQLRequest<any>,
  UserContext<any>
>;

export type GraphQLServerContext<
  TGlobalContext extends GlobalServerContext = GlobalServerContext,
  TExecutionContext extends GraphQLExecutionServerContext = GraphQLExecutionServerContext,
  TBindings = unknown
> = ServerContext<TGlobalContext, TExecutionContext> & {
  execution: GraphQLExecutionServerContext;
  bindings?: TBindings;
} & YogaInitialContext;

export const extractExecution = (
  context: GraphQLServerContext<
    GlobalServerContext<Array<IEntity>>,
    GraphQLExecutionServerContext
  >
) => context?.execution as GraphQLExecutionServerContext;

export const extractGraphQLRequest = (
  context: GraphQLServerContext<
    GlobalServerContext<Array<IEntity>>,
    GraphQLExecutionServerContext
  >
): GraphQLExecutionServerContext["request"] =>
  extractExecution(context)?.request;

export const extractOperationName = (
  context: GraphQLServerContext<
    GlobalServerContext<Array<IEntity>>,
    GraphQLExecutionServerContext
  >
): GraphQLExecutionServerContext["operationName"] =>
  extractExecution(context)?.operationName;
