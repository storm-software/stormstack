/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  CreateServerContextParams,
  ServerContext,
  UserContext,
  WhereParams,
  WhereUniqueParams
} from "@open-system/core-server-application";
import { IEntity } from "@open-system/core-server-domain/types";
import { ArrayElement } from "@open-system/core-shared-utilities/types";
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

export type GraphQLServerContext<
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
  TRequest = any
> = ServerContext<
  TUser,
  TEntities,
  TNamespace,
  TEntityMapping,
  TSelectKeys,
  TCacheKeys
> & {
  request: TRequest;
};

export type CreateGraphQLServerContextParams<
  TUser extends UserContext = UserContext
> = CreateServerContextParams<TUser> & {
  request: any;
};

export interface CacheStore<T = any> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
}
