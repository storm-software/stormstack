import {
  SentryPluginOptions,
  useSentry as useSentryExt,
} from "@envelop/sentry";
import type { Plugin } from "@envelop/types";
import { DefinitionNode, Kind, print } from "graphql";
import { GraphQLServerContext } from "../types";

export const useSentry = (options: SentryPluginOptions = {}): Plugin => {
  return useSentryExt({
    startTransaction: false,
    renameTransaction: false,
    /**
     * When it's not `null`, the plugin modifies the error object.
     * We end up with an unintended error masking, because the GraphQLYogaError is replaced with GraphQLError (without error.originalError).
     */
    eventIdKey: null,
    includeRawResult: false,
    includeResolverArgs: false,
    includeExecuteVariables: true,
    operationName: () => "graphql",
    configureScope(args, scope) {
      const transaction = scope.getTransaction();

      // Get the operation name from the request, or use the operation name from the document.
      const operationName =
        args.operationName ??
        args.document.definitions.find(
          (def: DefinitionNode) => def.kind === Kind.OPERATION_DEFINITION
        )?.kind ??
        "unknown";
      const ctx = args.contextValue as GraphQLServerContext;
      const clientNameHeaderValue = ctx.headers["graphql-client-name"];
      const clientName = Array.isArray(clientNameHeaderValue)
        ? clientNameHeaderValue[0]
        : clientNameHeaderValue;

      if (transaction) {
        transaction.setName(`graphql.${operationName}`);
        transaction.setTag("graphql_client_name", clientName ?? "unknown");
        // Reduce the number of transactions to avoid overloading Sentry
        transaction.sampled = !!clientName && clientName !== "Hive Client";
      }

      scope.setContext("Extra Info", {
        operationName,
        variables: JSON.stringify(args.variableValues),
        operation: print(args.document),
        userId: ctx?.user.id,
      });
    },
    appendTags: ({ contextValue }) => {
      const userId = (contextValue as GraphQLServerContext)?.user.id;
      const requestId = (contextValue as GraphQLServerContext).requestId;

      return {
        userId,
        requestId,
      };
    },
    skip(args) {
      // It's the readiness check
      return args.operationName === "readiness";
    },
    ...options,
  });
};
