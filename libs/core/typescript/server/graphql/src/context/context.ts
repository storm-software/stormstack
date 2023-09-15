/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  ActiveContext,
  HttpRequest,
  InitialServerContext,
  ServerContext,
  UserContext
} from "@open-system/core-server-application/context";
import { IEntity } from "@open-system/core-server-domain/types";
import { GraphQLParams, YogaInitialContext } from "graphql-yoga";

export type GraphQLRequest<TVariables = any> = HttpRequest<
  GraphQLParams<TVariables>
>;

export type GraphQLActiveContext<
  TVariables = any,
  TRequest extends GraphQLRequest<TVariables> = GraphQLRequest<TVariables>,
  TUser extends UserContext<any> = UserContext<any>
> = ActiveContext<TRequest, TUser> & {
  operationName: string;
};

export type GraphQLActiveServerContext = GraphQLActiveContext<
  any,
  GraphQLRequest<any>,
  UserContext<any>
>;

export type GraphQLServerContext<
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext,
  TBindings = unknown
> = ServerContext<TInitialContext, TActiveContext> & {
  active: GraphQLActiveServerContext;
  bindings?: TBindings;
} & YogaInitialContext;

export const extractActive = (
  context: GraphQLServerContext<
    InitialServerContext<Array<IEntity>>,
    GraphQLActiveServerContext
  >
) => context?.active as GraphQLActiveServerContext;

export const extractGraphQLRequest = (
  context: GraphQLServerContext<
    InitialServerContext<Array<IEntity>>,
    GraphQLActiveServerContext
  >
): GraphQLActiveServerContext["request"] => extractActive(context)?.request;

export const extractOperationName = (
  context: GraphQLServerContext<
    InitialServerContext<Array<IEntity>>,
    GraphQLActiveServerContext
  >
): GraphQLActiveServerContext["operationName"] =>
  extractActive(context)?.operationName;
