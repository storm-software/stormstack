/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLogger as useLoggerExt } from "@envelop/core";
import { Plugin } from "@envelop/types";
import { UserContext } from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { GraphQLServerContext } from "../types";

export const useLogger = <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext
>(params: {
  context: GraphQLServerContext<TEntities, TUser>;
}): Plugin<GraphQLServerContext<TEntities, TUser>> => {
  return useLoggerExt({
    logFn: async (eventName, args) => {
      const context =
        (args.contextValue as GraphQLServerContext<TEntities, TUser>) ??
        params.context;

      const logger = context.utils.logger;
      await logger.info(`Event triggered: ${eventName}`);
      await logger.debug(context.utils.parser.stringify(args));
    },
    skipIntrospection: true
  }) as Plugin<GraphQLServerContext<TEntities, TUser>>;
};
