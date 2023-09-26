import { isGraphQLError } from "@envelop/core";
import {
  createGraphQLError as createGraphQLErrorExt,
  relocatedError as relocatedErrorExt
} from "@graphql-tools/utils";
import { JsonParser } from "@stormstack/core-shared-serialization";
import {
  BaseError,
  IncorrectTypeError
} from "@stormstack/core-shared-utilities";
import {
  isError,
  isString
} from "@stormstack/core-shared-utilities/common/type-checks";
import { ASTNode, GraphQLError, Source } from "graphql";

type Maybe<T> = null | undefined | T;
export interface GraphQLErrorOptions {
  nodes?: ReadonlyArray<ASTNode> | ASTNode | null;
  source?: Maybe<Source>;
  positions?: Maybe<ReadonlyArray<number>>;
  path?: Maybe<ReadonlyArray<string | number>>;
  originalError?: Maybe<
    Error & {
      readonly extensions?: unknown;
    }
  >;
  extensions?: any;
}

export const createGraphQLError = (
  error: string | Error,
  options?: GraphQLErrorOptions
): GraphQLError => {
  if (isString(error)) {
    return createGraphQLErrorExt(error, options);
  } else if (isGraphQLError(error)) {
    return createGraphQLErrorExt(error.message, {
      originalError: error,
      ...options,
      ...error
    });
  } else if (BaseError.isBaseError(error)) {
    return createGraphQLErrorExt(error.toString(), {
      extensions: {
        name: error.name,
        code: error.code,
        message: error.message,
        extendedMessage: error.extendedMessage,
        stacktrace: error.stack,
        formErrors: {
          formErrors: error.formErrors.formErrors,
          fieldErrors: error.formErrors.fieldErrors
        },
        issues: error.issues.map(issue => JsonParser.stringify(issue))
      },
      originalError: error
    });
  } else if (isError(error)) {
    return createGraphQLErrorExt(error.toString(), {
      originalError: error
    });
  } else {
    error = new IncorrectTypeError(
      "Incorrect type provided when trying to create a GraphQLError"
    );
    return createGraphQLErrorExt(error.message, {
      originalError: error
    });
  }
};

export const relocatedError = (
  originalError: GraphQLError,
  path?: ReadonlyArray<string | number>
): GraphQLError => {
  return relocatedErrorExt(originalError, path ?? originalError.path);
};
