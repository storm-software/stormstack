/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "@envelop/types";
import {
  RepositoryMapping,
  UserContext
} from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { GraphQLServerContext, RepositoryPluginParams } from "../types";

export const useRepositoryProvider = <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext,
  TRequestData = any
>(
  params: RepositoryPluginParams<TEntities, TUser, TRequestData>
): Plugin<GraphQLServerContext<TEntities, TUser, TRequestData>> => {
  return {
    onContextBuilding({ context, extendContext }) {
      extendContext({
        repositories: params.reduce((ret, { namespace, builderFn }) => {
          const repository = builderFn?.(context);
          if (!repository) {
            return ret;
          }

          return {
            ...ret,
            [namespace]: repository
          };
        }, {}) as RepositoryMapping<TEntities>
      });
    }
  };
};
