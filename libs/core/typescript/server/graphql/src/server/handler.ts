import {
  InitialServerContext,
  createServerContext,
  extractSystem
} from "@open-system/core-server-application/context";
import { Injector } from "@open-system/core-shared-injection";
import { Logger } from "@open-system/core-shared-logging/logger";
import * as fetchAPI from "@whatwg-node/node-fetch";
import { createYoga } from "graphql-yoga";
import { GraphQLActiveServerContext, GraphQLServerContext } from "../context";
import { createPlugins } from "../plugins";
import { CreateGraphQLHandlerOptions, GraphQLServerInstance } from "../types";

export const createGraphQLHandler = async <
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext,
  TServerContext extends GraphQLServerContext<
    TInitialContext,
    TActiveContext
  > = GraphQLServerContext<TInitialContext, TActiveContext>
>(
  options: CreateGraphQLHandlerOptions<
    TInitialContext,
    TActiveContext,
    TServerContext
  >
): Promise<GraphQLServerInstance<TServerContext>> => {
  const injector = options.injector ?? Injector;
  const logger = injector.get(Logger);

  const context = await createServerContext<TInitialContext>({
    ...options,
    injector,
    logger
  });

  const plugins = await createPlugins({
    ...options,
    context
  });

  const system = extractSystem(context);
  const yoga = createYoga<TServerContext, TServerContext>({
    ...options,
    id: system.info.serviceId,
    multipart: true,
    logging: logger,
    graphqlEndpoint: context.env.get("GRAPHQL_PATH") ?? "/graphql",
    healthCheckEndpoint: context.env.get("HEALTH_CHECK_PATH") ?? "/healthcheck",
    context: context as unknown as TServerContext,
    plugins,
    fetchAPI
  });

  return yoga;
};
