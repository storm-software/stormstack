/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "@envelop/types";
import {
  ServiceMapping,
  UserContext
} from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { GraphQLServerContext, ServicePluginParams } from "../types";

export const useServiceProvider = <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext,
  TRequestData = any
>(
  params: ServicePluginParams<TEntities, TUser, TRequestData>
): Plugin<GraphQLServerContext<TEntities, TUser, TRequestData>> => {
  return {
    onContextBuilding({ context, extendContext }) {
      extendContext({
        services: params.reduce((ret, { namespace, builderFn }) => {
          const service = builderFn?.(context);
          if (!service) {
            return ret;
          }

          return {
            ...ret,
            [namespace]: service
          };
        }, {}) as ServiceMapping<TEntities>
      });
    }
  };
};
