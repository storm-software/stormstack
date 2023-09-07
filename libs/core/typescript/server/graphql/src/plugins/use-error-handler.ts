/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isGraphQLError,
  useErrorHandler as useErrorHandlerExt
} from "@envelop/core";
import { UserContext } from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { GraphQLServerContext } from "../types";

export const useErrorHandler = <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext
>(params: {
  context: GraphQLServerContext<TEntities, TUser>;
}) => {
  return useErrorHandlerExt<GraphQLServerContext<TEntities, TUser>>(
    ({ errors, context: ctx }) => {
      // Not sure what changed, but the `context` is now an object with a contextValue property.
      // We previously relied on the `context` being the `contextValue` itself.
      /*const ctx = (
      "contextValue" in context ? context.contextValue : context
    ) as Context;*/

      const context = (ctx?.contextValue ??
        ctx ??
        params.context) as GraphQLServerContext<TEntities, TUser>;
      for (const error of errors) {
        if (isGraphQLError(error)) {
          context.utils.logger.error(error);
        }
      }
    }
  );
};
