/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  CreateServerContextParams,
  ProcessContext,
  ServerContext,
  ServiceMapping,
  ServiceMappingIndex,
  UserContext
} from "@open-system/core-server-application";
import { IEntity } from "@open-system/core-server-domain/types";
import { ArrayElement } from "@open-system/core-shared-utilities";
import { MergedScalars } from "@pothos/core";
import { FetchAPI, PromiseOrValue, YogaInitialContext } from "graphql-yoga";
import {
  GraphiQLOptions,
  GraphiQLOptionsOrFactory
} from "graphql-yoga/typings/plugins/use-graphiql";
import { YogaSchemaDefinition } from "graphql-yoga/typings/plugins/use-schema";

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

export type GraphQLRequestContext<TRequestData = any> = ProcessContext & {
  operation: string;
  data: TRequestData;
};

export type GraphQLServerContext<
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext,
  TRequestData = any
> = ServerContext<TEntities, TUser> & {
  request: GraphQLRequestContext<TRequestData>;
} & YogaInitialContext;

export type CreateGraphQLServerContextParams<
  TUser extends UserContext = UserContext,
  TRequestData = any
> = CreateServerContextParams<TUser> & {
  operation?: string;
  data?: TRequestData;
};

export type ServicePluginParams<
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext,
  TRequestData = any
> = Array<{
  namespace: ServiceMappingIndex<ArrayElement<TEntities>>;
  builderFn: (
    context: GraphQLServerContext<TEntities, TUser, TRequestData>
  ) => ServiceMapping<TEntities>[ServiceMappingIndex<ArrayElement<TEntities>>];
}>;

export type CreateGraphQLServerPluginsParams<
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext,
  TRequestData = any
> = {
  serviceConfig: ServicePluginParams<TEntities, TUser, TRequestData>;
  context: GraphQLServerContext<TEntities, TUser, TRequestData>;
};

export type CreateGraphQLHandlerParams<
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext,
  TServerContext extends GraphQLServerContext<
    TEntities,
    TUser
  > = GraphQLServerContext<TEntities, TUser>,
  TRequestData = any
> = CreateGraphQLServerContextParams<TUser> &
  CreateGraphQLServerPluginsParams<TEntities, TUser, TRequestData> & {
    /**
     * Whether the landing page should be shown.
     */
    landingPage?: boolean | undefined;

    /**
     * GraphiQL options
     *
     * @default true
     */
    graphiql?: GraphiQLOptionsOrFactory<TServerContext> | undefined;

    renderGraphiQL?:
      | ((options?: GraphiQLOptions) => PromiseOrValue<BodyInit>)
      | undefined;

    schema?: YogaSchemaDefinition<TServerContext> | undefined;

    fetchAPI?: Partial<Record<keyof FetchAPI, any>> | undefined;

    /**
     * GraphQL Multipart Request spec support
     *
     * @see https://github.com/jaydenseric/graphql-multipart-request-spec
     *
     * @default true
     */
    multipart?: boolean | undefined;
  };

export interface CacheStore<T = any> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
}

export interface ResolvedGlobalId {
  type: string;
  id: string;
}
