/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  createServerContext,
  extractRequest
} from "@open-system/core-server-application/context";
import { UserContext } from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import {
  CreateGraphQLServerContextParams,
  GraphQLRequestContext,
  GraphQLServerContext
} from "../types";

export const createGraphQLServerContext = <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext
>({
  operation,
  data,
  ...params
}: CreateGraphQLServerContextParams<TUser>): GraphQLServerContext<
  TEntities,
  TUser
> => {
  const serverContext = createServerContext<TEntities, TUser>(params);

  return {
    ...serverContext,
    request: {
      ...serverContext.request,
      operation,
      data
    }
  } as unknown as GraphQLServerContext<TEntities, TUser>;
};

export const extractRequestData = <TRequestData = any>(
  context: GraphQLServerContext
) => (extractRequest(context) as GraphQLRequestContext<TRequestData>)?.data;

export const extractOperation = (context: GraphQLServerContext) => {
  const request = extractRequest(context) as GraphQLRequestContext;
  return request?.operation;
};
