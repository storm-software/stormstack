/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  EventSourcedServerContext,
  UserContext
} from "@open-system/core-server-application";
import { MergedScalars, SchemaTypes } from "@pothos/core";
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";

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

export type ApiServerConnection = {
  pageCursors: PageCursors;
};

export type TableModel<
  TDatabase,
  TTypename extends keyof TDatabase
> = AllSelection<TDatabase, TTypename> & { __typename: TTypename | string };

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

export type ApiSchemaType<
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
};

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

export type GraphQLServerContext<TUser extends UserContext = UserContext> =
  EventSourcedServerContext<TUser> & {
    request: any;
    requestId: string;
    headers: Record<string, string | string[] | undefined>;
  };

export interface CacheStore<T = any> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
}
