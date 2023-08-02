import type { Plugin } from "@envelop/types";
import * as Sentry from "@sentry/node";

export const useSentryUser = (): Plugin<{
  user: any;
}> => {
  return {
    onExecute({ args }) {
      const userId = args.contextValue.user?.id;

      if (userId) {
        Sentry.configureScope(scope => {
          scope.setUser({
            id: userId,
          });
        });
      }
    },
  };
};
