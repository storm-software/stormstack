/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnExecuteDoneEventPayload } from "@envelop/core";
import { GlobalServerContext } from "@open-system/core-server-application/context/global-context";
import { isError } from "@open-system/core-shared-utilities/common/type-checks";
import {
  createGraphQLError,
  handleStreamOrSingleExecutionResult
} from "graphql-yoga";
import {
  GraphQLExecutionServerContext,
  GraphQLServerContext
} from "../context/context";

export const useErrorHandler = <
  TGlobalContext extends GlobalServerContext = GlobalServerContext,
  TExecutionContext extends GraphQLExecutionServerContext = GraphQLExecutionServerContext
>(
  context: TGlobalContext
) => {
  return {
    async onExecute() {
      return {
        onExecuteDone(
          payload: OnExecuteDoneEventPayload<
            GraphQLServerContext<TGlobalContext, TExecutionContext>
          >
        ) {
          return handleStreamOrSingleExecutionResult(
            payload,
            ({ result, setResult }) => {
              // Not sure what changed, but the `context` is now an object with a contextValue property.
              // We previously relied on the `context` being the `contextValue` itself.
              /*const ctx = (
                "contextValue" in context ? context.contextValue : context
              ) as Context;*/

              /* const ctx = (context?.contextValue ??
                context ??
                initialContext) as GraphQLServerContext<
                TGlobalContext,
                TExecutionContext
              >;
              for (const error of errors) {
                if (isGraphQLError(error)) {
                  ctx.utils.logger.error(error);
                }
              }*/

              const logger = context.utils.logger;
              logger.error(
                "An error occurred while executing the server request."
              );

              const errors = result.errors?.map(error => {
                if (isError(error.originalError)) {
                  logger.error(error.originalError);
                  return createGraphQLError(error.message, {
                    extensions: error.extensions,
                    originalError: error
                  });
                } else {
                  logger.error(error);
                  return error;
                }
              });

              setResult({
                data: result.data,
                errors,
                extensions: result.extensions || {}
              });
            }
          );
        }
      };
    }
  };
};
