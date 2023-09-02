/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "@envelop/types";
import { Repository } from "@open-system/core-server-application/repositories";
import {
  UserContext,
  WhereParams,
  WhereUniqueParams
} from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { ArrayElement } from "@open-system/core-shared-utilities/types";
import { GraphQLServerContext } from "../types";

export const useRepositoryProvider = <
  TUser extends UserContext = UserContext,
  TEntities extends Array<IEntity> = Array<IEntity>,
  TNamespace extends ArrayElement<TEntities>["__typename"] = ArrayElement<TEntities>["__typename"],
  TEntityMapping extends Record<TNamespace, ArrayElement<TEntities>> = Record<
    TNamespace,
    ArrayElement<TEntities>
  >,
  TSelectKeys extends Record<
    TNamespace,
    | WhereParams<TEntityMapping[TNamespace], keyof TEntityMapping[TNamespace]>
    | WhereUniqueParams<
        TEntityMapping[TNamespace],
        keyof TEntityMapping[TNamespace]
      >
    | Record<string, never>
  > = Record<
    TNamespace,
    | WhereParams<TEntityMapping[TNamespace], keyof TEntityMapping[TNamespace]>
    | WhereUniqueParams<
        TEntityMapping[TNamespace],
        keyof TEntityMapping[TNamespace]
      >
    | Record<string, never>
  >,
  TCacheKeys = TSelectKeys,
  TServerContext extends GraphQLServerContext<
    TUser,
    TEntities,
    TNamespace,
    TEntityMapping,
    TSelectKeys,
    TCacheKeys
  > = GraphQLServerContext<
    TUser,
    TEntities,
    TNamespace,
    TEntityMapping,
    TSelectKeys,
    TCacheKeys
  >
>(
  params: Array<{
    namespace: TNamespace;
    builderFn: (
      context: TServerContext
    ) => Repository<
      TEntityMapping[TNamespace],
      TSelectKeys[TNamespace],
      TCacheKeys
    >;
  }>
): Plugin<any> => {
  return {
    onContextBuilding({ context, extendContext }) {
      extendContext({
        repositories: params.map(({ namespace, builderFn }) => {
          const repository = builderFn?.(context as any as TServerContext);
          if (!repository) {
            return {};
          }
          return {
            [namespace]: repository
          };
        })
      });
    }
  };
};
