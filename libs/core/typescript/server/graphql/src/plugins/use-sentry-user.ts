import type { Plugin } from "@envelop/types";
import {
  ServerContext,
  extractUserId
} from "@open-system/core-server-application";
import * as Sentry from "@sentry/node";
import { GraphQLServerContext } from "../types";

export const useSentryUser = <
  TContext extends ServerContext = GraphQLServerContext
>(): Plugin<TContext> => {
  return {
    onExecute({ args }) {
      const userId = extractUserId(args.contextValue);
      if (userId) {
        Sentry.configureScope(scope => {
          scope.setUser({
            id: userId
          });
        });
      }
    }
  };
};
