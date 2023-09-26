import {
  GlobalContext,
  createGlobalContext,
  extractSystem
} from "@stormstack/core-server-application/context";
import { EMPTY_STRING } from "@stormstack/core-shared-utilities";
import {
  isSet,
  isString
} from "@stormstack/core-shared-utilities/common/type-checks";
import { createYoga } from "graphql-yoga";
import { GraphQLExecutionContext, GraphQLServerContext } from "../context";
import { createPlugins } from "../plugins";
import { CreateGraphQLHandlerOptions, GraphQLServerInstance } from "../types";
//import { fetchAPI } from "./fetch-api";

export const createGraphQLHandler = async <
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends GraphQLExecutionContext = GraphQLExecutionContext,
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
  const context = await createGlobalContext<TGlobalContext>(options);

  const plugins = await createPlugins({
    ...options,
    context
  });

  const system = extractSystem(context);
  const isDevelopment = context.env.isDevelopment;

  const yoga = createYoga<TServerContext, TServerContext>({
    ...options,
    id: system?.info?.serviceId,
    multipart: true,
    maskedErrors: isSet(options.maskedErrors)
      ? options.maskedErrors
      : !isDevelopment,
    landingPage: isSet(options.landingPage)
      ? options.landingPage
      : isDevelopment,
    graphiql:
      (!isSet(options.allowGraphiQL) && isDevelopment) || options.allowGraphiQL
        ? {
            title: `⚡ Storm Cloud ${
              isString(system?.info?.serviceId)
                ? ` - ${system?.info?.serviceId} `
                : EMPTY_STRING
            }- GraphQL Playground`,
            subscriptionsProtocol: "GRAPHQL_SSE"
          }
        : false,
    logging: context.utils.logger ?? context.env.get("LOG_LEVEL"),
    graphqlEndpoint: context.env.get("GRAPHQL_PATH") ?? "/graphql",
    healthCheckEndpoint: context.env.get("HEALTH_CHECK_PATH") ?? "/healthcheck",
    plugins
  });

  return yoga;
};
