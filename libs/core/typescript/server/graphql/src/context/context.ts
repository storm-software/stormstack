/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  createServerContext,
  UserContext
} from "@open-system/core-server-application";
import {
  CreateGraphQLServerContextParams,
  GraphQLServerContext
} from "../types";

export const createGraphQLServerContext = <
  TUser extends UserContext = UserContext
>({
  request,
  ...params
}: CreateGraphQLServerContextParams<TUser>): GraphQLServerContext<TUser> => {
  return {
    ...createServerContext(params),
    request
  };
};

export const extractRequest = (context?: GraphQLServerContext) =>
  context?.request;
