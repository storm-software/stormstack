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
import {
  UserContext,
  createContext
} from "@open-system/core-server-application";
import { JsonParser } from "@open-system/core-shared-serialization";
import { Logger } from "@open-system/core-shared-utilities";
import { useReadinessCheck } from "graphql-yoga";
import { GraphQLServerContext } from "../types";
import { useHive } from "./use-hive";
import { useResponseCache } from "./use-response-cache";
import { useSentry } from "./use-sentry";
import { useSentryUser } from "./use-sentry-user";

export const createPlugins = async <
  TUser extends UserContext = UserContext,
  TServerContext extends GraphQLServerContext<TUser> = GraphQLServerContext<TUser>
>({
  injector,
  env
}: {
  injector: TServerContext["injector"];
  env: TServerContext["env"];
}): Promise<Plugin<any>[]> => {
  return [
    useSentry(),
    useSentryUser(),
    useExtendContext(async (context: Partial<TServerContext>) =>
      createContext({ ...context, env, injector })
    ),
    useLogger({
      logFn: async (eventName, args) => {
        const logger = injector.get(Logger);

        await logger?.info?.(`Event triggered: ${eventName}`);
        await logger?.info?.(JsonParser.stringify(args));
      }
    }),
    useErrorHandler(({ errors }) => {
      // Not sure what changed, but the `context` is now an object with a contextValue property.
      // We previously relied on the `context` being the `contextValue` itself.
      /*const ctx = (
        "contextValue" in context ? context.contextValue : context
      ) as Context;*/

      for (const error of errors) {
        if (isGraphQLError(error)) {
          console.error(error);
          continue;
        } else {
          console.error(error);
        }

        injector.get(Logger)?.error?.(error);
      }
    }),
    useParserCache(),
    useValidationCache(),
    useResponseCache(),
    useReadinessCheck({
      endpoint: "/health",
      check: async () => {
        try {
          await injector.get(Logger)?.info?.("Running server readiness check");
          return true;
        } catch (e) {
          await injector.get(Logger)?.error?.(e);
          return false;
        }
      }
    }),
    await useHive(env)
  ];
};
