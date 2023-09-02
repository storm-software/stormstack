import { Plugin } from "@envelop/types";
import { useHive as useHiveExt } from "@graphql-hive/client";
import {
  UserContext,
  WhereParams,
  WhereUniqueParams
} from "@open-system/core-server-application";
import { IEntity } from "@open-system/core-server-domain/types";
import { ArrayElement } from "@open-system/core-shared-utilities/types";
import { GraphQLServerContext } from "../types";

export const useHive = async <
  TUser extends UserContext = UserContext,
  TEntities extends Array<IEntity> = Array<IEntity>,
  TNamespace extends ArrayElement<TEntities>["__typename"] = ArrayElement<TEntities>["__typename"],
  TEntityMapping extends Record<TNamespace, ArrayElement<TEntities>> = Record<
    TNamespace,
    ArrayElement<TEntities>
  >,
  TSelectKeys extends Record<
    TNamespace,
    | WhereParams<TEntityMapping[TNamespace], keyof TEntityMapping[TNamespace]>
    | WhereUniqueParams<
        TEntityMapping[TNamespace],
        keyof TEntityMapping[TNamespace]
      >
    | Record<string, never>
  > = Record<
    TNamespace,
    | WhereParams<TEntityMapping[TNamespace], keyof TEntityMapping[TNamespace]>
    | WhereUniqueParams<
        TEntityMapping[TNamespace],
        keyof TEntityMapping[TNamespace]
      >
    | Record<string, never>
  >,
  TCacheKeys = TSelectKeys,
  TServerContext extends GraphQLServerContext<
    TUser,
    TEntities,
    TNamespace,
    TEntityMapping,
    TSelectKeys,
    TCacheKeys
  > = GraphQLServerContext<
    TUser,
    TEntities,
    TNamespace,
    TEntityMapping,
    TSelectKeys,
    TCacheKeys
  >
>(
  context: TServerContext
): Promise<Plugin<any>> => {
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
    debug: context.env.isDevelopment,

    /**
     * Access Token
     */
    token: (await context.env.getAsync<string>("HIVE_ACCESS_TOKEN")) as string,

    /**
     * Collects schema usage based on operations
     *
     * Disabled by default
     */
    usage: {
      endpoint:
        (await context.env.getAsync("HIVE_CONTACT_SDL_URL")) ?? undefined,
      clientInfo(ctx: GraphQLServerContext<TUser>) {
        const name = ctx.headers["graphql-client-name"] as string;
        const version =
          (ctx.headers["graphql-client-version"] as string) ?? "missing";

        if (name) {
          return { name, version };
        }

        return null;
      },
      exclude: ["readiness"]
    } /*{
      clientInfo(ctx: { req: Request }) {
        const name =
          ctx.req.headers.get("x-graphql-client-name");
        const version =
          ctx.req.headers.get("x-graphql-client-version");

        return { name, version };
      }
    },*/,

    /**
     * Schema reporting
     *
     * Disabled by default
     */
    reporting: {
      /**
       * The end point to return the metadata
       */
      endpoint:
        (await context.env.getAsync("HIVE_CONTACT_METADATA_URL")) ?? undefined,

      /**
       * Author of current version of the schema
       */
      author: context.env.repositoryWorker,

      /**
       * Commit SHA hash (or any identifier) related to the schema version
       */
      commit: context.env.get("NX_HEAD") ?? "0.0.1",

      /**
       * URL to the service (use only for distributed schemas)
       */
      serviceUrl: context.env.serviceUrl,

      /**
       * Name of the service (use only for distributed schemas)
       */
      serviceName: context.env.serviceName
    }

    /**
     * Operations Store
     */
    // operationsStore: undefined
  }) as Plugin<any>;
};
