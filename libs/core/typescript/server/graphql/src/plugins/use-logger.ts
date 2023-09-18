/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLogger as useLoggerExt } from "@envelop/core";
import { Plugin } from "@envelop/types";
import { GlobalServerContext } from "@open-system/core-server-application/context/global-context";
import {
  GraphQLExecutionServerContext,
  GraphQLServerContext
} from "../context/context";

export type LoggerPluginOptions = {
  logFn?: typeof console.log;
  skipIntrospection?: boolean;
};

export const useLogger = <
  TInitialContext extends GlobalServerContext = GlobalServerContext,
  TActiveContext extends GraphQLExecutionServerContext = GraphQLExecutionServerContext
>(
  initialContext: TInitialContext,
  options?: LoggerPluginOptions
): Plugin<GraphQLServerContext<TInitialContext, TActiveContext>> => {
  return useLoggerExt({
    logFn: async (eventName, args) => {
      const context =
        (args.contextValue as GraphQLServerContext<
          TInitialContext,
          TActiveContext
        >) ?? initialContext;

      const logger = context.utils.logger;
      logger.info(`Event triggered: ${eventName}`);

      logger.debug(context.utils.parser.stringify(args));
    },
    skipIntrospection: options?.skipIntrospection ?? true
  }) as Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>;
};
