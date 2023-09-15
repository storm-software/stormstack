/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisableIntrospection } from "@envelop/disable-introspection";
import { useParserCache } from "@envelop/parser-cache";
import type { Plugin } from "@envelop/types";
import { useValidationCache } from "@envelop/validation-cache";
import { InitialServerContext } from "@open-system/core-server-application";
import { IEntity } from "@open-system/core-server-domain/types";
import { GraphQLActiveServerContext, GraphQLServerContext } from "../context";
import { GraphQLHandlerPluginOptions, PluginMapConfiguration } from "../types";
import { useErrorHandler } from "./use-error-handler";
import { useExtendGraphQLServerContext } from "./use-extend-graphql-server-context";
import { useLogger } from "./use-logger";
import { useReadinessCheck } from "./use-readiness-check";
import { useServiceProviders } from "./use-service-provider";

export const DefaultPluginMap: Required<PluginMapConfiguration> = {
  /**
   * The extend context plugin is used to extend the context of the GraphQL server.
   */
  extendContext: useExtendGraphQLServerContext,

  /**
   * The logger plugin is used to log messages to the Pino (by default).
   */
  logger: useLogger,

  /**
   * The error handler plugin is used to handle errors thrown by the GraphQL server.
   */
  serviceProviders: useServiceProviders
};

export const createPlugins = async <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TInitialContext extends InitialServerContext<TEntities> = InitialServerContext<TEntities>,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext
>({
  pluginMap = {},
  context,
  allowIntrospection,
  loggerOptions,
  extendContextOptions,
  serviceProvidersOptions
}: GraphQLHandlerPluginOptions<TEntities, TInitialContext, TActiveContext> & {
  context: TInitialContext;
}): Promise<
  Array<Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>>
> => {
  // Important: Plugins are executed in order of their usage, and inject functionality serially,
  // so the order here matters
  const plugins: Array<
    Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>
  > = [];

  try {
    if (
      context.env.isDevelopment && (allowIntrospection ?? true)
        ? false
        : !allowIntrospection
    ) {
      plugins.push(
        useDisableIntrospection() as Plugin<
          GraphQLServerContext<TInitialContext, TActiveContext>
        >
      );
    }

    plugins.push(
      pluginMap["extendContext"]?.(context, extendContextOptions) ??
        DefaultPluginMap["extendContext"](context, extendContextOptions)
    );

    plugins.push(
      pluginMap["logger"]?.(context, loggerOptions) ??
        DefaultPluginMap["logger"](context, loggerOptions)
    );

    // Add other plugins here

    plugins.push(
      pluginMap["serviceProviders"]?.(context, serviceProvidersOptions) ??
        DefaultPluginMap["serviceProviders"](context, serviceProvidersOptions)
    );
  } catch (error) {
    context.utils.logger.error(error);
  }

  return [
    /*useSentry(),
    useSentryUser(),*/

    ...plugins,
    useErrorHandler<TInitialContext, TActiveContext>(context),
    useParserCache() as Plugin<
      GraphQLServerContext<TInitialContext, TActiveContext>
    >,
    useValidationCache() as Plugin<
      GraphQLServerContext<TInitialContext, TActiveContext>
    >,
    useReadinessCheck<TInitialContext, TActiveContext>(context)
    /*await useHive<TInitialContext, TActiveContext>(context)*/
  ];
};
