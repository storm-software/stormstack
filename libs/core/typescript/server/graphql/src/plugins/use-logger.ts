/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLogger as useLoggerExt } from "@envelop/core";
import { Plugin } from "@envelop/types";
import { InitialServerContext } from "@open-system/core-server-application/context/initial-context";
import {
  GraphQLActiveServerContext,
  GraphQLServerContext
} from "../context/context";

export type LoggerPluginOptions = {
  logFn?: typeof console.log;
  skipIntrospection?: boolean;
};

export const useLogger = <
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext
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
      await logger.info(`Event triggered: ${eventName}`);

      await logger.debug(context.utils.parser.stringify(args));
    },
    skipIntrospection: options?.skipIntrospection ?? true
  }) as Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>;
};
