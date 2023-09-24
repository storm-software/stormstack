import type { Plugin } from "@envelop/types";
import {
  GlobalContext,
  extractUser
} from "@open-system/core-server-application";
import * as Sentry from "@sentry/node";
import {
  GraphQLExecutionContext,
  GraphQLServerContext
} from "../context/context";

export const useSentryUser = <
  TInitialContext extends GlobalContext = GlobalContext,
  TActiveContext extends GraphQLExecutionContext = GraphQLExecutionContext
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
