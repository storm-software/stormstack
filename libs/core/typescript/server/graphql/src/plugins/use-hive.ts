/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "@envelop/types";
import { useHive as useHiveExt } from "@graphql-hive/client";
import {
  HttpRequest,
  UserContext,
  extractRequestHeaders,
  extractSystem
} from "@open-system/core-server-application/context";
import { InitialServerContext } from "@open-system/core-server-application/context/initial-context";
import { IEntity } from "@open-system/core-server-domain/types";
import { GraphQLActiveContext, GraphQLServerContext } from "../context";

export const useHive = async <
  TInitialContext extends InitialServerContext<
    Array<IEntity>
  > = InitialServerContext<Array<IEntity>>,
  TActiveContext extends GraphQLActiveContext<
    HttpRequest,
    UserContext
  > = GraphQLActiveContext<HttpRequest, UserContext>
>(
  initialContext: TInitialContext
): Promise<Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>> => {
  const env = initialContext.env;
  const info = extractSystem(initialContext).info;

  return useHiveExt({
    /**
     * Enable/Disable Hive
     *
     * Default: true
     */
    enabled: true,

    /**
     * Debugging mode
     *
     * Default: false
     */
    debug: env.isDevelopment,

    /**
     * Access Token
     */
    token: (await env.getAsync<string>("HIVE_ACCESS_TOKEN")) as string,

    /**
     * Collects schema usage based on operations
     *
     * Disabled by default
     */
    usage: {
      endpoint: (await env.getAsync("HIVE_CONTACT_SDL_URL")) ?? undefined,
      clientInfo(
        context: GraphQLServerContext<TInitialContext, TActiveContext>
      ) {
        const headers = extractRequestHeaders(context);

        const name =
          (headers.get("x-graphql-client-name") as string) ?? info.name;
        const version =
          (headers.get("x-graphql-client-version") as string) ??
          info.version ??
          "missing";

        if (name) {
          return { name, version };
        }

        return null;
      },
      exclude: ["readiness"]
    },

    /**
     * Schema reporting
     *
     * Disabled by default
     */
    reporting: {
      /**
       * The end point to return the metadata
       */
      endpoint: (await env.getAsync("HIVE_CONTACT_METADATA_URL")) ?? undefined,

      /**
       * Author of current version of the schema
       */
      author: env.repositoryWorker,

      /**
       * Commit SHA hash (or any identifier) related to the schema version
       */
      commit: info.version,

      /**
       * URL to the service (use only for distributed schemas)
       */
      serviceUrl: info.url,

      /**
       * Name of the service (use only for distributed schemas)
       */
      serviceName: info.name
    }

    /**
     * Operations Store
     */
    // operationsStore: undefined
  }) as Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>;
};
