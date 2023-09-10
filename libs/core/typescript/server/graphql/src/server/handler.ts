import { extractSystem } from "@open-system/core-server-application/context/context";
import { UserContext } from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { Injector } from "@open-system/core-shared-injection";
import { Logger } from "@open-system/core-shared-utilities";
import { createYoga } from "graphql-yoga";
import { createGraphQLServerContext } from "../context";
import { createPlugins } from "../plugins";
import { CreateGraphQLHandlerParams, GraphQLServerContext } from "../types";

export const createGraphQLHandler = async <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext,
  TServerContext extends GraphQLServerContext<
    TEntities,
    TUser
  > = GraphQLServerContext<TEntities, TUser>
>(
  params: CreateGraphQLHandlerParams<TEntities, TUser, TServerContext>
) => {
  const injector = params.injector ?? Injector;
  const logger = injector.get(Logger);

  let context = params.context;
  if (!context) {
    context = createGraphQLServerContext<TEntities, TUser>({
      ...params,
      injector,
      logger
    });
  }

  const plugins = await createPlugins<TEntities, TUser>({
    ...params,
    context
  });

  const system = extractSystem(context);
  const yoga = createYoga<TServerContext>({
    ...params,
    id: system.info.serviceId,
    multipart: true,
    logging: logger,
    graphqlEndpoint: system.env.get("GRAPHQL_PATH") ?? "/graphql",
    healthCheckEndpoint: system.env.get("HEALTH_CHECK_PATH") ?? "/health",
    context,
    plugins
  });

  return yoga;
};
