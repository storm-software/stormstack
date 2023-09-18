/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "@envelop/types";
import { ServiceMapping } from "@open-system/core-server-application/context";
import {
  GlobalServerContext,
  ServiceMappingIndex
} from "@open-system/core-server-application/context/global-context";
import { IEntity } from "@open-system/core-server-domain/types";
import { ArrayElement } from "@open-system/core-shared-utilities/types";
import {
  GraphQLExecutionServerContext,
  GraphQLServerContext
} from "../context/context";

export type ServiceProvidersPluginOptions<
  TEntities extends Array<IEntity> = Array<IEntity>,
  TInitialContext extends GlobalServerContext = GlobalServerContext,
  TActiveContext extends GraphQLExecutionServerContext = GraphQLExecutionServerContext
> = {
  services: Array<{
    namespace: ServiceMappingIndex<ArrayElement<TEntities>>;
    builderFn: (
      context: GraphQLServerContext<TInitialContext, TActiveContext>
    ) => ServiceMapping<TEntities>[ServiceMappingIndex<
      ArrayElement<TEntities>
    >];
  }>;
};

export const useServiceProviders = <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TInitialContext extends GlobalServerContext = GlobalServerContext,
  TActiveContext extends GraphQLExecutionServerContext = GraphQLExecutionServerContext
>(
  initialContext: TInitialContext,
  options?: ServiceProvidersPluginOptions<
    TEntities,
    TInitialContext,
    TActiveContext
  >
): Plugin<GraphQLServerContext<TInitialContext, TActiveContext>> => {
  return {
    onContextBuilding({ context, extendContext }) {
      extendContext({
        ...context,
        services: (options
          ? options.services.reduce((ret, { namespace, builderFn }) => {
              const service = builderFn?.(context);
              if (!service) {
                return ret;
              }

              return {
                ...ret,
                [namespace as string]: service
              };
            }, {})
          : {}) as ServiceMapping<TEntities>
      });
    }
  };
};
