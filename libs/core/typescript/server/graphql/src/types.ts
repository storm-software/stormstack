/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { ComplexServerContext } from "@open-system/core-server-services/application/context";
import { MergedScalars, SchemaTypes } from "@pothos/core";
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";
import { GraphQLServerContext } from "./context";

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
  TContext extends GraphQLServerContext = GraphQLServerContext,
  TScalars extends SchemaScalars = SchemaScalars
> = SchemaTypes & {
  Context: TContext;
  Scalars: TScalars;
  Connection: {
    pageCursors: PageCursors;
  };
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

export type GraphQLServerContext<
  TDatabase = {},
  TContext = {}
> = ComplexServerContext<TContext> & {
  database: TDatabase;
  request: any;
  requestId: string;
  headers: Record<string, string | string[] | undefined>;
};

export type GraphQLComplexServerContext<
  TDatabase = {},
  TContext = {}
> = GraphQLServerContext<TDatabase, TContext> & ComplexServerContext<TContext>;

export type GraphQLSimpleServerContext<
  TDatabase = {},
  TContext = {}
> = GraphQLServerContext<TDatabase, TContext> & SimpleServerContext<TContext>;
