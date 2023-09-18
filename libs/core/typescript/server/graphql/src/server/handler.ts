import {
  GlobalServerContext,
  createServerContext,
  extractSystem
} from "@open-system/core-server-application/context";
import { createYoga } from "graphql-yoga";
import {
  GraphQLExecutionServerContext,
  GraphQLServerContext
} from "../context";
import { createPlugins } from "../plugins";
import { CreateGraphQLHandlerOptions, GraphQLServerInstance } from "../types";
import { fetchAPI } from "./fetch-api";

export const createGraphQLHandler = async <
  TGlobalContext extends GlobalServerContext = GlobalServerContext,
  TExecutionContext extends GraphQLExecutionServerContext = GraphQLExecutionServerContext,
  TServerContext extends GraphQLServerContext<
    TGlobalContext,
    TExecutionContext
  > = GraphQLServerContext<TGlobalContext, TExecutionContext>
>(
  options: CreateGraphQLHandlerOptions<
    TGlobalContext,
    TExecutionContext,
    TServerContext
  >
): Promise<GraphQLServerInstance<TServerContext>> => {
  const context = await createServerContext<TGlobalContext>(options);

  const plugins = await createPlugins({
    ...options,
    context
  });

  const system = extractSystem(context);
  const yoga = createYoga<TServerContext, TServerContext>({
    ...options,
    id: system.info.serviceId,
    multipart: true,
    logging: context.utils.logger,
    graphqlEndpoint: context.env.get("GRAPHQL_PATH") ?? "/graphql",
    healthCheckEndpoint: context.env.get("HEALTH_CHECK_PATH") ?? "/healthcheck",
    context: context as unknown as TServerContext,
    plugins,
    fetchAPI
  });

  return yoga;
};
