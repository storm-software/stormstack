import type { Plugin } from "@envelop/types";
import { UserContext } from "@open-system/core-server-application";
import { Logger } from "@open-system/core-shared-utilities";
import { createYoga } from "graphql-yoga";
import { createPlugins } from "../plugins";
import { GraphQLServerContext } from "../types";

export const createGraphQLHandler = async <
  TUser extends UserContext = UserContext,
  TServerContext extends GraphQLServerContext<TUser> = GraphQLServerContext<TUser>
>({
  injector,
  env,
  plugins
}: {
  env: TServerContext["env"];
  injector: TServerContext["injector"];
  plugins: Array<Plugin<TServerContext>>;
}) => {
  if (!plugins) {
    plugins = await createPlugins<TUser, TServerContext>({ injector, env });
  }

  /*const application = createApplication({
    modules
  });

  const documentCache = createCacheStore<DocumentNode>(cache, "document");
  const errorCache = createCacheStore<Error>(cache, "error");
  const validationCache = createCacheStore<typeof validate>(
    cache,
    "validation"
  );*/

  const server = createYoga<TServerContext>({
    logging: injector.get(Logger),
    plugins,
    context: { injector, env }
  });

  return server;
};
