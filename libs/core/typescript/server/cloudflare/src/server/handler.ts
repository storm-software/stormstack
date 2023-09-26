/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  GlobalContext,
  UtilityContext
} from "@stormstack/core-server-application/context/global-context";
import { getGlobalContextStore } from "@stormstack/core-server-application/context/global-context-store";
import {
  GraphQLExecutionContext,
  GraphQLServerContext
} from "@stormstack/core-server-graphql/context/context";
import { createGraphQLHandler } from "@stormstack/core-server-graphql/server/handler";
import {
  CreateGraphQLHandlerOptions,
  GraphQLServerInstance
} from "@stormstack/core-server-graphql/types";
import { ConsoleLogger } from "@stormstack/core-shared-logging/console/console-logger";
import { isError } from "@stormstack/core-shared-utilities/common/type-checks";
import { extendCloudflareServerContext } from "../context/extend-context";
import { CloudflareServerBindings } from "../types";

export type CreateCloudflareGraphQLHandlerOptions<
  TGlobalContext extends GlobalContext<
    any,
    UtilityContext,
    CloudflareServerBindings
  > = GlobalContext<any, UtilityContext, CloudflareServerBindings>,
  TExecutionContext extends GraphQLExecutionContext = GraphQLExecutionContext,
  TServerContext extends GraphQLServerContext<
    TGlobalContext,
    TExecutionContext
  > = GraphQLServerContext<TGlobalContext, TExecutionContext>
> = CreateGraphQLHandlerOptions<
  TGlobalContext,
  TExecutionContext,
  TServerContext
>;

let server!: GraphQLServerInstance<any>;
const globalContextStore = getGlobalContextStore();

export const handleCloudflareGraphQLRequest = <
  TGlobalContext extends GlobalContext<
    any,
    UtilityContext,
    CloudflareServerBindings
  > = GlobalContext<any, UtilityContext, CloudflareServerBindings>,
  TExecutionContext extends GraphQLExecutionContext = GraphQLExecutionContext,
  TServerContext extends GraphQLServerContext<
    TGlobalContext,
    TExecutionContext
  > = GraphQLServerContext<TGlobalContext, TExecutionContext>
>(
  request: Request,
  options: CreateCloudflareGraphQLHandlerOptions<
    TGlobalContext,
    TExecutionContext,
    TServerContext
  >,
  bindings?: CloudflareServerBindings
): Promise<Response> => {
  return globalContextStore.run(new Map(), () => {
    ConsoleLogger.debug("Starting Cloudflare Worker Request", request);

    return Promise.resolve(
      getCloudflareGraphQLServer(
        {
          ...options,
          extendContextOptions: {
            ...options.extendContextOptions,
            plugin: options.extendContextOptions
              ? Array.isArray(options.extendContextOptions)
                ? [
                    extendCloudflareServerContext,
                    ...options.extendContextOptions
                  ]
                : [extendCloudflareServerContext, options.extendContextOptions]
              : extendCloudflareServerContext
          }
        },
        bindings
      ).then(server =>
        server.fetch(request, {
          request,
          bindings
        })
      )
    )
      .then(result => {
        if (isError(result)) {
          ConsoleLogger.error(result);
          return new Response((result as Error).message, {
            status: 500,
            ...result
          });
        }

        return result;
      })
      .catch(error => {
        if (isError(error)) {
          ConsoleLogger.fatal(error);
          return new Response(error.message, {
            status: 500,
            ...error
          });
        }

        return error;
      });
  });
};

const getCloudflareGraphQLServer = async <
  TGlobalContext extends GlobalContext<
    any,
    UtilityContext,
    CloudflareServerBindings
  > = GlobalContext<any, UtilityContext, CloudflareServerBindings>,
  TExecutionContext extends GraphQLExecutionContext = GraphQLExecutionContext,
  TServerContext extends GraphQLServerContext<
    TGlobalContext,
    TExecutionContext
  > = GraphQLServerContext<TGlobalContext, TExecutionContext>
>(
  options: CreateCloudflareGraphQLHandlerOptions<
    TGlobalContext,
    TExecutionContext,
    TServerContext
  >,
  bindings?: CloudflareServerBindings
) => {
  if (!server) {
    server = await createGraphQLHandler<
      TGlobalContext,
      TExecutionContext,
      TServerContext
    >({
      ...options,
      env: bindings as Record<string, string | number | boolean>,
      bindings: { env: bindings, ...bindings }
    });
  }

  return server;
};
