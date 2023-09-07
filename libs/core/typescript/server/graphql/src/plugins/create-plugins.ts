/* eslint-disable @typescript-eslint/no-explicit-any */
import { useExtendContext } from "@envelop/core";
import { useParserCache } from "@envelop/parser-cache";
import type { Plugin } from "@envelop/types";
import { useValidationCache } from "@envelop/validation-cache";
import { UserContext } from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import {
  CreateGraphQLServerPluginsParams,
  GraphQLServerContext
} from "../types";
import { useErrorHandler } from "./use-error-handler";
import { useHive } from "./use-hive";
import { useLogger } from "./use-logger";
import { useReadinessCheck } from "./use-readiness-check";
import { useRepositoryProvider } from "./use-repository-provider";
import { useResponseCache } from "./use-response-cache";
import { useSentry } from "./use-sentry";
import { useSentryUser } from "./use-sentry-user";

export const createPlugins = async <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext
>(
  params: CreateGraphQLServerPluginsParams<TEntities, TUser>
) => {
  const context = params.context;

  return [
    useSentry(),
    useSentryUser(),
    useExtendContext(
      async (ctx: Partial<GraphQLServerContext<TEntities, TUser>>) => ({
        ...params.context,
        ...ctx
      })
    ),
    useLogger<TEntities, TUser>({ context }),
    useErrorHandler<TEntities, TUser>({ context }),
    useParserCache(),
    useValidationCache(),
    useResponseCache(),
    useReadinessCheck<TEntities, TUser>({ context }),
    await useHive<TEntities, TUser>({ context }),
    useRepositoryProvider<TEntities, TUser>(params.repositoryPluginConfig)
  ] as Array<Plugin<GraphQLServerContext<TEntities, TUser>>>;
};
