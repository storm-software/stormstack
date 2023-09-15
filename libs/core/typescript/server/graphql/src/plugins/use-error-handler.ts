/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isGraphQLError,
  useErrorHandler as useErrorHandlerExt
} from "@envelop/core";
import { InitialServerContext } from "@open-system/core-server-application/context/initial-context";
import {
  GraphQLActiveServerContext,
  GraphQLServerContext
} from "../context/context";

export const useErrorHandler = <
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext
>(
  initialContext: TInitialContext
) => {
  return useErrorHandlerExt<
    GraphQLServerContext<TInitialContext, TActiveContext>
  >(({ errors, context }) => {
    // Not sure what changed, but the `context` is now an object with a contextValue property.
    // We previously relied on the `context` being the `contextValue` itself.
    /*const ctx = (
      "contextValue" in context ? context.contextValue : context
    ) as Context;*/

    const ctx = (context?.contextValue ??
      context ??
      initialContext) as GraphQLServerContext<TInitialContext, TActiveContext>;
    for (const error of errors) {
      if (isGraphQLError(error)) {
        ctx.utils.logger.error(error);
      }
    }
  });
};
