/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "@envelop/types";
import { useHive as useHiveExt } from "@graphql-hive/client";
import { extractSystemInfo } from "@open-system/core-server-application/context/context";
import { UserContext } from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { GraphQLServerContext } from "../types";

export const useHive = async <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext
>(params: {
  context: GraphQLServerContext<TEntities, TUser>;
}): Promise<Plugin<GraphQLServerContext<TEntities, TUser>>> => {
  const context = params.context;
  const env = context.system.env;
  const info = extractSystemInfo(context);

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
      clientInfo(ctx: GraphQLServerContext<TEntities, TUser>) {
        const name =
          (ctx.request.headers["x-graphql-client-name"] as string) ?? info.name;
        const version =
          (ctx.request.headers["x-graphql-client-version"] as string) ??
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
  }) as Plugin<GraphQLServerContext<TEntities, TUser>>;
};
