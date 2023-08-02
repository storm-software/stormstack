import { isGraphQLError } from "@envelop/core";
import { useGraphQLModules } from "@envelop/graphql-modules";
import { pinoLogger } from "@open-system/core-server-pino-logger";
import { UserContext } from "@open-system/core-server-services";
import { Module, createApplication } from "graphql-modules";
import { createYoga, useErrorHandler } from "graphql-yoga";
import { useResponseCache, useSentry, useSentryUser } from "../envelop";
import { GraphQLServerContext } from "../types";

export const createGraphQLHandler = <
  TUser extends UserContext = UserContext,
  TServerContext extends GraphQLServerContext<TUser> = GraphQLServerContext<TUser>
>(
  modules: Module[]
) => {
  const application = createApplication({
    modules,
  });

  const server = createYoga<TServerContext>({
    logging: pinoLogger,
    plugins: [
      useGraphQLModules(application),
      useSentry(),
      useSentryUser(),
      useErrorHandler(({ errors }): void => {
        // Not sure what changed, but the `context` is now an object with a contextValue property.
        // We previously relied on the `context` being the `contextValue` itself.
        /*const ctx = (
          "contextValue" in context ? context.contextValue : context
        ) as Context;*/

        for (const error of errors) {
          if (isGraphQLError(error) && error.originalError) {
            console.error(error);
            console.error(error.originalError);
            continue;
          } else {
            console.error(error);
          }

          server?.logger?.error?.(error);
        }
      }),
      useResponseCache(),
    ],
  });

  return server;
};
