import type { Plugin } from "@envelop/types";
import {
  GlobalServerContext,
  extractUser
} from "@open-system/core-server-application";
import * as Sentry from "@sentry/node";
import {
  GraphQLExecutionServerContext,
  GraphQLServerContext
} from "../context/context";

export const useSentryUser = <
  TInitialContext extends GlobalServerContext = GlobalServerContext,
  TActiveContext extends GraphQLExecutionServerContext = GraphQLExecutionServerContext
>(
  _: TInitialContext
): Plugin<GraphQLServerContext<TInitialContext, TActiveContext>> => {
  return {
    onExecute(params) {
      const context = params.args.contextValue as GraphQLServerContext<
        TInitialContext,
        TActiveContext
      >;
      const user = extractUser(context);
      if (user) {
        Sentry.configureScope(scope => {
          scope.setUser({
            id: user.id,
            username: user.name,
            email: user.email
          });
          scope.setContext("context", context);
        });
      }
    }
  };
};
