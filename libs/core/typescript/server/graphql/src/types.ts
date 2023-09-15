/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import type { AllowedOperations } from "@envelop/filter-operation-type";
import type { GraphQLArmorConfig } from "@escape.tech/graphql-armor-types";
import { IExecutableSchemaDefinition } from "@graphql-tools/schema/typings/types";
import {
  CreateServerContextParams,
  InitialServerContext
} from "@open-system/core-server-application";
import { IEntity } from "@open-system/core-server-domain";
import { MergedScalars } from "@pothos/core";
import { DocumentNode } from "graphql";
import type {
  FetchAPI,
  GraphiQLOptions,
  Plugin,
  PromiseOrValue,
  YogaServerInstance,
  YogaServerOptions
} from "graphql-yoga";
import { GraphiQLOptionsOrFactory } from "graphql-yoga/typings/plugins/use-graphiql";
import { YogaSchemaDefinition } from "graphql-yoga/typings/plugins/use-schema";
import { GraphQLActiveServerContext, GraphQLServerContext } from "./context";
import { ExtendContextOptions, ServiceProvidersPluginOptions } from "./plugins";
import { LoggerPluginOptions } from "./plugins/use-logger";

export interface PageCursor {
  cursor: string;
  pageNumber: number;
  isCurrent: boolean;
}

export interface PageCursors {
  first: PageCursor;
  around: PageCursor[];
  last: PageCursor;
}

export type ArmorConfig = {
  logContext?: boolean;
  logErrors?: boolean;
} & GraphQLArmorConfig;

/*export type ApiServerConnection = {
  pageCursors: PageCursors;
};

export type TableModel<
  TDatabase,
  TTypename extends keyof TDatabase
> = AllSelection<TDatabase, TTypename> & { __typename: TTypename | string };*/

export type SchemaScalars = MergedScalars<any> & {
  UUID: {
    Input: string;
    Output: string;
  };
  Date: {
    Input: Date;
    Output: string;
  };
  DateTime: {
    Input: Date;
    Output: Date;
  };
  URL: {
    Input: unknown;
    Output: unknown;
  };
  PostalCode: {
    Input: string;
    Output: string;
  };
  CountryCode: {
    Input: string;
    Output: string;
  };
  PhoneNumber: {
    Input: string;
    Output: string;
  };
  EmailAddress: {
    Input: string;
    Output: string;
  };
  Currency: {
    Input: string;
    Output: string;
  };
  Duration: {
    Input: string;
    Output: string;
  };
  IP: {
    Input: string;
    Output: string;
  };
  Latitude: {
    Input: number;
    Output: number;
  };
  Longitude: {
    Input: number;
    Output: number;
  };
  Locale: {
    Input: string;
    Output: string;
  };
  SemVer: {
    Input: string;
    Output: string;
  };
  JWT: {
    Input: string;
    Output: string;
  };
};

/*export type ApiSchemaType<
  PrismaTypes,
  TContext extends GraphQLServerContext = GraphQLServerContext,
  TScalars extends SchemaScalars = SchemaScalars
> = SchemaTypes & {
  Objects: SchemaTypes["Objects"] & PageCursor & PageCursors;
  Context: TContext;
  Scalars: TScalars;
  Connection: {
    pageCursors: PageCursors;
  };
  PrismaTypes: PrismaTypes;
};*/

export interface GraphQLHandlerOptions {
  graphiqlEndpoint: string;
  registry: any;
  signature: string;
  supertokens: {
    connectionUri: string;
    apiKey: string;
  };
  isProduction: boolean;
  hiveConfig: any;
  release: string;
}

export interface CacheStore<T = any> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
}

export interface ResolvedGlobalId {
  type: string;
  id: string;
}

export type Decoded = Record<string, unknown> | null;

interface DecodedWithRoles extends Record<string, unknown> {
  roles: string | string[];
}

interface DecodedWithMetadata extends Record<string, unknown> {
  [key: string]: Record<string, unknown>;
}

export const AUTH_PROVIDER_HEADER = "auth-provider";

export interface TokenWithRoles {
  decoded: DecodedWithRoles;
}

export interface TokenWithMetadata {
  decoded: DecodedWithMetadata;
  namespace?: string;
}

export interface AuthorizationHeader {
  schema: "Bearer" | "Basic" | string;
  token: string;
}

export type AuthContextPayload = [
  Decoded,
  { type: string } & AuthorizationHeader,
  { event: any; context: any }
];

export type Decoder = (
  token: string,
  type: string,
  req: { event: any; context: any }
) => Promise<Decoded>;

export type GetCurrentUser = (
  decoded: AuthContextPayload[0],
  raw: AuthContextPayload[1],
  req?: AuthContextPayload[2]
) => Promise<null | Record<string, unknown> | string>;

export type CorsConfig = {
  origin?: boolean | string | string[];
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
};

export type SdlGlobImports = {
  [key: string]: {
    schema: DocumentNode;
    resolvers: Record<string, unknown>;
  };
};

export type Resolver = (...args: unknown[]) => unknown;
export type Services = {
  [funcName: string]: Resolver;
};

// e.g. imported service
// [{ posts_posts: {
// createPost: () => {..},
// deletePost: () => {...}
// }, ]
export type ServicesGlobImports = {
  [serviceName: string]: Services;
};

/*
We want directivesGlobs type to be an object with this shape:
But not fully supported in TS
{
  schema: DocumentNode // <-- required
  [string]: StormDirective
}
*/
export type DirectiveGlobImports = Record<string, any>;

export type GenerateGraphiQLHeader = () => string;

export type GraphQLServerInstance<
  TServerContext extends GraphQLServerContext = GraphQLServerContext
> = YogaServerInstance<TServerContext, TServerContext>;

export type PluginMapConfiguration = {
  /**
   * The extend context plugin is used to extend the context of the GraphQL server.
   */
  extendContext?: <
    TInitialContext extends InitialServerContext = InitialServerContext,
    TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext
  >(
    initialContext: TInitialContext,
    extendContextOptions?: ExtendContextOptions
  ) => Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>;

  /**
   * The logger plugin is used to log the GraphQL server.
   */
  logger?: <
    TInitialContext extends InitialServerContext = InitialServerContext,
    TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext
  >(
    initialContext: TInitialContext,
    options?: LoggerPluginOptions
  ) => Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>;

  serviceProviders?: <
    TEntities extends Array<IEntity> = Array<IEntity>,
    TInitialContext extends InitialServerContext = InitialServerContext,
    TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext
  >(
    initialContext: TInitialContext,
    options?: ServiceProvidersPluginOptions<
      TEntities,
      TInitialContext,
      TActiveContext
    >
  ) => Plugin<GraphQLServerContext<TInitialContext, TActiveContext>>;
};

export type GraphQLHandlerPluginOptions<
  TEntities extends Array<IEntity> = Array<IEntity>,
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext
> = CreateServerContextParams & {
  /**
   * The plugin map configuration is used to configure the plugins that are used by the GraphQL server.
   */
  pluginMap?: PluginMapConfiguration | undefined;

  /**
   * @description The identifier used in the GraphQL health check response.
   * It verifies readiness when sent as a header in the readiness check request.
   *
   * By default, the identifier is `yoga` as seen in the HTTP response header `x-yoga-id: yoga`
   */
  healthCheckId?: string;

  /**
   * @description Customize GraphQL Context values
   *
   */
  extendContextOptions?: ExtendContextOptions;

  /**
   * @description Customize GraphQL Logger
   *
   * Collect resolver timings, and exposes trace data for
   * an individual request under extensions as part of the GraphQL response.
   */
  loggerOptions?: LoggerPluginOptions;

  /**
   * @description Customize GraphQL Context values
   *
   */
  serviceProvidersOptions: ServiceProvidersPluginOptions<
    TEntities,
    TInitialContext,
    TActiveContext
  >;

  /**
   * @description An async function that maps the auth token retrieved from the
   * request headers to an object.
   * Is it executed when the `auth-provider` contains one of the supported
   * providers.
   */
  // getCurrentUser?: GetCurrentUser;

  /**
   * @description A callback when an unhandled exception occurs. Use this to disconnect your prisma instance.
   */
  onException?: () => void;

  /**
   * @description Services passed from the glob import:
   * import services from 'src/services\/**\/*.{js,ts}'
   */
  //services: ServicesGlobImports;

  /**
   * @description SDLs (schema definitions) passed from the glob import:
   * import sdls from 'src/graphql\/**\/*.{js,ts}'
   */
  //sdls: SdlGlobImports;

  /**
   * @description Directives passed from the glob import:
   * import directives from 'src/directives/**\/*.{js,ts}'
   */
  directives?: DirectiveGlobImports;

  /**
   * @description A list of options passed to [makeExecutableSchema]
   * (https://www.graphql-tools.com/docs/generate-schema/#makeexecutableschemaoptions).
   */
  schemaOptions?: Partial<IExecutableSchemaDefinition>;

  /**
   *  @description Customize GraphQL Armor plugin configuration
   *
   * @see https://escape-technologies.github.io/graphql-armor/docs/configuration/examples
   */
  armorConfig?: ArmorConfig;

  /**
   * @description Customize the default error message used to mask errors.
   *
   * By default, the masked error message is "Something went wrong"
   *
   * @see https://github.com/dotansimha/envelop/blob/main/packages/core/docs/use-masked-errors.md
   */
  defaultError?: string;

  /**
   * @description Only allows the specified operation types (e.g. subscription, query or mutation).
   *
   * By default, only allow query and mutation (ie, do not allow subscriptions).
   *
   * An array of GraphQL's OperationTypeNode enums:
   * - OperationTypeNode.SUBSCRIPTION
   * - OperationTypeNode.QUERY
   * - OperationTypeNode.MUTATION
   *
   * @see https://github.com/dotansimha/envelop/tree/main/packages/plugins/filter-operation-type
   */
  allowedOperations?: AllowedOperations;

  /**
   * @description Allow schema introspection.
   * By default, schema introspection is disabled in production. Explicitly set this to true or false to override in all environments.
   */
  allowIntrospection?: boolean;

  /**
   * @description Custom Envelop plugins
   */
  extraPlugins?: Plugin[];
};

export type CreateGraphQLHandlerOptions<
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext,
  TServerContext extends GraphQLServerContext<
    TInitialContext,
    TActiveContext
  > = GraphQLServerContext<TInitialContext, TActiveContext>
> = YogaServerOptions<TServerContext, TServerContext> &
  CreateServerContextParams &
  GraphQLHandlerPluginOptions & {
    /**
     * Whether the landing page should be shown.
     */
    landingPage?: boolean | undefined;

    /**
     * GraphiQL options
     */
    graphiql?: GraphiQLOptionsOrFactory<TServerContext>;

    renderGraphiQL?:
      | ((options?: GraphiQLOptions) => PromiseOrValue<BodyInit>)
      | undefined;

    schema: YogaSchemaDefinition<TServerContext> | undefined;

    fetchAPI?: Partial<Record<keyof FetchAPI, any>> | undefined;

    /**
     * GraphQL Multipart Request spec support
     *
     * @see https://github.com/jaydenseric/graphql-multipart-request-spec
     *
     * @default true
     */
    multipart?: boolean | undefined;

    /**
     * @description The identifier used in the GraphQL health check response.
     * It verifies readiness when sent as a header in the readiness check request.
     *
     * By default, the identifier is `yoga` as seen in the HTTP response header `x-yoga-id: yoga`
     */
    healthCheckId?: string;

    /**
     * @description Customize GraphQL Logger
     *
     * Collect resolver timings, and exposes trace data for
     * an individual request under extensions as part of the GraphQL response.
     */
    // loggerConfig: LoggerConfig;

    /**
     * @description Modify the resolver and global context.
     */
    context?: TServerContext | ((request: any) => TServerContext);

    /**
     * @description An async function that maps the auth token retrieved from the
     * request headers to an object.
     * Is it executed when the `auth-provider` contains one of the supported
     * providers.
     */
    // getCurrentUser?: GetCurrentUser;

    /**
     * @description A callback when an unhandled exception occurs. Use this to disconnect your prisma instance.
     */
    onException?: () => void;

    /**
     * @description Services passed from the glob import:
     * import services from 'src/services\/**\/*.{js,ts}'
     */
    //services: ServicesGlobImports;

    /**
     * @description SDLs (schema definitions) passed from the glob import:
     * import sdls from 'src/graphql\/**\/*.{js,ts}'
     */
    //sdls: SdlGlobImports;

    /**
     * @description Directives passed from the glob import:
     * import directives from 'src/directives/**\/*.{js,ts}'
     */
    directives?: DirectiveGlobImports;

    /**
     * @description A list of options passed to [makeExecutableSchema]
     * (https://www.graphql-tools.com/docs/generate-schema/#makeexecutableschemaoptions).
     */
    schemaOptions?: Partial<IExecutableSchemaDefinition>;

    /**
     *  @description Customize GraphQL Armor plugin configuration
     *
     * @see https://escape-technologies.github.io/graphql-armor/docs/configuration/examples
     */
    armorConfig?: ArmorConfig;

    /**
     * @description Customize the default error message used to mask errors.
     *
     * By default, the masked error message is "Something went wrong"
     *
     * @see https://github.com/dotansimha/envelop/blob/main/packages/core/docs/use-masked-errors.md
     */
    defaultError?: string;

    /**
     * @description Only allows the specified operation types (e.g. subscription, query or mutation).
     *
     * By default, only allow query and mutation (ie, do not allow subscriptions).
     *
     * An array of GraphQL's OperationTypeNode enums:
     * - OperationTypeNode.SUBSCRIPTION
     * - OperationTypeNode.QUERY
     * - OperationTypeNode.MUTATION
     *
     * @see https://github.com/dotansimha/envelop/tree/main/packages/plugins/filter-operation-type
     */
    allowedOperations?: AllowedOperations;

    /**
     * @description Custom Envelop plugins
     */
    extraPlugins?: Plugin[];

    /**
     * @description Auth-provider specific token decoder
     */
    authDecoder?: Decoder | Decoder[];

    /**
     * @description Customize the GraphiQL Endpoint that appears in the location bar of the GraphQL Playground
     *
     * Defaults to '/graphql' as this value must match the name of the `graphql` function on the api-side.
     */
    graphiQLEndpoint?: string;

    /**
     * @description Allow GraphiQL playground.
     * By default, GraphiQL playground is disabled in production. Explicitly set this to true or false to override in all environments.
     */
    allowGraphiQL?: boolean;

    /**
     * @description Allow schema introspection.
     * By default, schema introspection is disabled in production. Explicitly set this to true or false to override in all environments.
     */
    allowIntrospection?: boolean;

    /**
     * @description Function that returns custom headers (as string) for GraphiQL.
     *
     * Headers must set auth-provider, Authorization and (if using dbAuth) the encrypted cookie.
     */
    generateGraphiQLHeader?: GenerateGraphiQLHeader;

    /**
     * @description Configure RedwoodRealtime plugin with subscriptions and live queries
     *
     * Only supported in a server deploy and not allowed with GraphQLHandler config
     */
    // realtime?: RedwoodRealtimeOptions;

    /**
     * @description Configure OpenTelemetry plugin behavior
     */
    // openTelemetryOptions?: RedwoodOpenTelemetryConfig;
  };
