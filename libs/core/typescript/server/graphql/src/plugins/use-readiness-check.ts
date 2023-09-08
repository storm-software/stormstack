/* eslint-disable @typescript-eslint/no-explicit-any */
import { extractSystemInfo } from "@open-system/core-server-application/context/context";
import { UserContext } from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { useReadinessCheck as useReadinessCheckExt } from "graphql-yoga";
import { GraphQLServerContext } from "../types";

export const useReadinessCheck = <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext
>(params: {
  context: GraphQLServerContext<TEntities, TUser>;
}) => {
  const context = params.context;
  const system = context.system;

  return useReadinessCheckExt({
    endpoint: system.env.get("READINESS_CHECK_PATH") ?? "/ready",
    check: async () => {
      const logger = context.utils.logger;
      const info = extractSystemInfo(context);

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
  });
};
