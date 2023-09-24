/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnExecuteDoneEventPayload } from "@envelop/core";
import { GlobalContext } from "@open-system/core-server-application/context/global-context";
import { isError, isString } from "@open-system/core-shared-utilities";
import { BaseError } from "@open-system/core-shared-utilities/errors/base-error";
import { GraphQLError } from "graphql";
import { handleStreamOrSingleExecutionResult } from "graphql-yoga";
import { createGraphQLError } from "../api/graphql-error";
import {
  GraphQLExecutionContext,
  GraphQLServerContext
} from "../context/context";

export const useErrorHandler = <
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends GraphQLExecutionContext = GraphQLExecutionContext
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
              const logger = context.utils.logger;
              const errors = result.errors?.reduce(
                (ret: GraphQLError[], error) => {
                  let graphQLError: GraphQLError | undefined;
                  if (
                    error.originalError &&
                    BaseError.isBaseError(error.originalError)
                  ) {
                    logger.debug(
                      `'Converting ${error.originalError.name} (error code: ${error.originalError.code}) to GraphQLError`
                    );

                    graphQLError = createGraphQLError(error, {
                      originalError: error
                    });
                  } else if (isError(error) || isString(error)) {
                    graphQLError = createGraphQLError(error);
                  }

                  if (graphQLError) {
                    logger.error(graphQLError);
                    ret.push(error);
                  }

                  return ret;
                },
                []
              );

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
