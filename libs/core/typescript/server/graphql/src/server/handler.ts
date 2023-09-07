import { UserContext } from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { Injector } from "@open-system/core-shared-injection";
import { Logger } from "@open-system/core-shared-utilities";
import { createYoga } from "graphql-yoga";
import { createGraphQLServerContext } from "../context";
import { createPlugins } from "../plugins";
import { CreateGraphQLHandlerParams } from "../types";

export const createGraphQLHandler = async <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext
>(
  params: CreateGraphQLHandlerParams<TEntities, TUser>
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

  const server = createYoga({
    logging: logger,
    healthCheckEndpoint:
      context.system.env.get("HEALTH_CHECK_PATH") ?? "/health",
    context,
    plugins
  });

  return server;
};
