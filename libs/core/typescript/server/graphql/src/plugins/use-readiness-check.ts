/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "@envelop/types";
import { extractSystemInfo } from "@open-system/core-server-application/context";
import { InitialServerContext } from "@open-system/core-server-application/context/initial-context";
import { useReadinessCheck as useReadinessCheckExt } from "graphql-yoga";
import {
  GraphQLActiveServerContext,
  GraphQLServerContext
} from "../context/context";

export const useReadinessCheck = <
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext
>(
  initialContext: TInitialContext
): Plugin<GraphQLServerContext<TInitialContext, TActiveContext>> => {
  return useReadinessCheckExt({
    endpoint: initialContext.env.get("READINESS_CHECK_PATH") ?? "/readiness",
    check: async () => {
      const logger = initialContext.utils.logger;
      const info = extractSystemInfo(initialContext);

      try {
        await logger.info(
          `Running server readiness check - ${info.name}-v${info.version}`
        );

        return true;
      } catch (e) {
        await logger.info(
          `Failed the server readiness check - ${info.name}-v${info.version}`
        );
        await logger.error(e);
        return false;
      }
    }
  }) as Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>;
};
