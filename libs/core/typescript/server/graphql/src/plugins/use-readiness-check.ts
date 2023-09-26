/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "@envelop/types";
import { extractSystemInfo } from "@stormstack/core-server-application/context";
import { GlobalContext } from "@stormstack/core-server-application/context/global-context";
import { useReadinessCheck as useReadinessCheckExt } from "graphql-yoga";
import {
  GraphQLExecutionContext,
  GraphQLServerContext
} from "../context/context";

export const useReadinessCheck = <
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends GraphQLExecutionContext = GraphQLExecutionContext
>(
  initialContext: TGlobalContext
): Plugin<GraphQLServerContext<TGlobalContext, TExecutionContext>> => {
  return useReadinessCheckExt({
    endpoint: initialContext.env.get("READINESS_CHECK_PATH") ?? "/readiness",
    check: async () => {
      const logger = initialContext.utils.logger;
      const info = extractSystemInfo(initialContext);

      try {
        logger.info(
          `Running server readiness check - ${info.name}-v${info.version}`
        );

        return true;
      } catch (e) {
        logger.info(
          `Failed the server readiness check - ${info.name}-v${info.version}`
        );
        logger.error(e);
        return false;
      }
    }
  }) as Plugin<GraphQLServerContext<TGlobalContext, TExecutionContext>>;
};
