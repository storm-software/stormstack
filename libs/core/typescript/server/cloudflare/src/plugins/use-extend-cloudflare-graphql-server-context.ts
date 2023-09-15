/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Plugin } from "@envelop/types";
import {
  BINDINGS_TOKEN,
  InitialServerContext
} from "@open-system/core-server-application";
import { isDrizzleSqliteDB } from "@open-system/core-server-drizzle/utilities";
import {
  GraphQLActiveServerContext,
  GraphQLServerContext
} from "@open-system/core-server-graphql/context";
import {
  ExtendContextOptions,
  useExtendGraphQLServerContext
} from "@open-system/core-server-graphql/plugins";
import { isSet } from "@open-system/core-shared-utilities/common/type-checks";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { CloudflareServerBindingsContext } from "../types";

export const useExtendCloudflareGraphQLServerContext = <
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext
>(
  initialContext: TInitialContext,
  options?: ExtendContextOptions
): Plugin<
  GraphQLServerContext<
    TInitialContext,
    TActiveContext,
    CloudflareServerBindingsContext
  >
> => {
  const basePlugin = useExtendGraphQLServerContext<
    TInitialContext,
    TActiveContext,
    CloudflareServerBindingsContext
  >(initialContext, options);

  return {
    async onPluginInit(options) {
      return basePlugin.onPluginInit?.(options);
    },
    async onContextBuilding(params) {
      const requestBindings = params.context.bindings.env;

      let database: DrizzleD1Database<Record<string, unknown>> | undefined;
      if (isDrizzleSqliteDB(requestBindings?.DB)) {
        // We've already set up the bindings, nothing to do here
        return basePlugin.onContextBuilding?.(params);

        // database = requestBindings.DB;
      } else if (isSet(requestBindings?.DB)) {
        database = drizzle(requestBindings?.DB);
      } else {
        params.context.utils.logger.warn(
          "No database found in Cloudflare bindings."
        );
      }

      const enrichedBindings: CloudflareServerBindingsContext = {
        env: requestBindings,
        database
      };
      const pluginHook = basePlugin.onContextBuilding?.({
        ...params,
        context: { ...params.context, bindings: enrichedBindings }
      });

      params.context.injector
        .bind<CloudflareServerBindingsContext>(BINDINGS_TOKEN)
        .toConstantValue(enrichedBindings);

      return pluginHook;
    }
  };
};
