import {
  SentryPluginOptions,
  useSentry as useSentryExt
} from "@envelop/sentry";
import type { Plugin } from "@envelop/types";
import {
  GlobalContext,
  extractCorrelationId,
  extractRequestId,
  extractSystemInfo,
  extractUserId
} from "@stormstack/core-server-application";
import { JsonParser } from "@stormstack/core-shared-serialization";
import { MissingContextError } from "@stormstack/core-shared-utilities";
import { print } from "graphql";
import {
  GraphQLExecutionContext,
  GraphQLServerContext
} from "../context/context";

export const useSentry = <
  TInitialContext extends GlobalContext = GlobalContext,
  TActiveContext extends GraphQLExecutionContext = GraphQLExecutionContext
>(
  initialContext: TInitialContext,
  options: SentryPluginOptions = {}
): Plugin<GraphQLServerContext<TInitialContext, TActiveContext>> => {
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

      const context = args.contextValue as GraphQLServerContext<
        TInitialContext,
        TActiveContext
      >;
      if (!context) {
        throw new MissingContextError("Context is missing");
      }

      const operationName = args.operationName ?? "unknown";
      const clientNameHeaderValue = context.request.headers.get(
        "graphql-client-name"
      );
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
        eventIdKey: context.system.info.serviceId,
        operationName,
        transactionName: context.system.info.domainName,
        variables: JsonParser.stringify(args.variableValues),
        operation: print(args.document),
        userId: context?.execution.user.id
      });
    },
    appendTags: ({ contextValue }) => {
      const context = contextValue as GraphQLServerContext<
        TInitialContext,
        TActiveContext
      >;
      if (!context) {
        throw new MissingContextError("Context is missing");
      }

      const userId = extractUserId(context);
      const correlationId = extractCorrelationId(context);
      const requestId = extractRequestId(context);
      const service = extractSystemInfo(context);

      return {
        correlationId,
        requestId,
        ...service,
        userId
      };
    },
    skip(args) {
      // It's the readiness check
      return args.operationName === "readiness";
    },
    ...options
  }) as Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>;
};
