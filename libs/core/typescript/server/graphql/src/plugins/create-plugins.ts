/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isGraphQLError,
  useErrorHandler,
  useExtendContext,
  useLogger
} from "@envelop/core";
import { useParserCache } from "@envelop/parser-cache";
import type { Plugin } from "@envelop/types";
import { useValidationCache } from "@envelop/validation-cache";
import { Repository } from "@open-system/core-server-application/repositories/repository";
import {
  UserContext,
  WhereParams,
  WhereUniqueParams
} from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { JsonParser } from "@open-system/core-shared-serialization/json-parser";
import { Logger } from "@open-system/core-shared-utilities/logging/logger";
import { ArrayElement } from "@open-system/core-shared-utilities/types";
import { useReadinessCheck } from "graphql-yoga";
import { createGraphQLServerContext } from "../context";
import { GraphQLServerContext } from "../types";
import { useHive } from "./use-hive";
import { useRepositoryProvider } from "./use-repository-provider";
import { useResponseCache } from "./use-response-cache";
import { useSentry } from "./use-sentry";
import { useSentryUser } from "./use-sentry-user";

export const createPlugins = async <
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
>({
  context,
  repositoryProviderParams = []
}: {
  context: TServerContext;
  repositoryProviderParams: Array<{
    namespace: TNamespace;
    builderFn: (
      context: TServerContext
    ) => Repository<
      TEntityMapping[TNamespace],
      TSelectKeys[TNamespace],
      TCacheKeys
    >;
  }>;
}): Promise<Array<Plugin<TServerContext>>> => {
  return [
    useSentry(),
    useSentryUser(),
    useExtendContext(async (ctx: Partial<TServerContext>) =>
      createGraphQLServerContext({ ...context, ...ctx })
    ),
    useLogger({
      logFn: async (eventName, args) => {
        const ctx = args.contextValue as TServerContext;
        const logger = ctx.injector.get(Logger);

        await logger?.info?.(`Event triggered: ${eventName}`);
        await logger?.info?.(JsonParser.stringify(args));
      }
    }),
    useErrorHandler<TServerContext>(({ errors, context: ctx }) => {
      // Not sure what changed, but the `context` is now an object with a contextValue property.
      // We previously relied on the `context` being the `contextValue` itself.
      /*const ctx = (
        "contextValue" in context ? context.contextValue : context
      ) as Context;*/

      let serverContext = ctx as TServerContext;
      if (!serverContext) {
        serverContext = context;
      }

      const logger = serverContext?.injector?.get?.(Logger) ?? context.logger;
      for (const error of errors) {
        if (isGraphQLError(error) && logger) {
          logger.error(error);
        }
      }
    }),
    useParserCache(),
    useValidationCache(),
    useResponseCache(),
    useReadinessCheck({
      endpoint: "/healthz",
      check: async () => {
        const logger = context?.injector?.get?.(Logger) ?? context.logger;
        try {
          await logger.info("Running server readiness check");

          return true;
        } catch (e) {
          await logger.error(e);
          return false;
        }
      }
    }),
    await useHive<
      TUser,
      TEntities,
      TNamespace,
      TEntityMapping,
      TSelectKeys,
      TCacheKeys,
      TServerContext
    >(context),
    useRepositoryProvider<
      TUser,
      TEntities,
      TNamespace,
      TEntityMapping,
      TSelectKeys,
      TCacheKeys,
      TServerContext
    >(repositoryProviderParams)
  ] as Array<Plugin<TServerContext>>;
};
