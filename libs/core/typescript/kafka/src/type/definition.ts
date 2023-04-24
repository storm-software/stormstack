import { RequestOptions } from 'http';
import { ClientHttp2Session } from 'http2';

import {
  GraphQLFieldConfigMap,
  GraphQLFieldResolver,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLScalarType,
} from 'graphql';

export interface KSqlDBEntities {
  [key: string]: {
    type: GraphQLObjectType | GraphQLScalarType;
  };
}

export type Request = (url: string, body: any, args: any) => void;
type KsqDBContext = { ksqlDB: { options: RequestOptions; session: ClientHttp2Session } };

export interface Config {
  options: RequestOptions;
}
type KsqldbType = 'BIGINT' | 'STRING' | 'INTEGER' | 'ARRAY' | 'VARCHAR' | 'STRUCT';
export interface MemberSchema {
  type: Exclude<'ARRAY' | 'STRUCT', KsqldbType>; // TODO - can you have arrays in member schemas?
}

export interface Field {
  name: string;
  schema: {
    type: KsqldbType;
    fields: Array<Field> | null;
    memberSchema: MemberSchema | null;
  };
}

type KsqlDBQuery = {
  queryString: string;
  sinks: Array<string>;
  sinkKafkaTopics: Array<string>;
  id: string;
  state: 'RUNNING';
} | null;

export interface KsqlDBResponse {
  name: string;
  readQueries: Array<KsqlDBQuery>;
  writeQueries: Array<KsqlDBQuery>;
  fields: Array<Field>;
  type: 'STREAM' | 'TABLE';
  key: string;
  timestamp: string;
  statistics: string;
  errorStats: string;
  extended: boolean;
  format: 'JSON' | 'AVRO'; // TODO verify this value
  topic: string;
  partitions: number;
  replication: number;
}
export interface Resolver {
  [key: string]: GraphQLFieldResolver<void, KsqDBContext>;
}
export interface SubscriptionResolver {
  [name: string]: {
    subscribe: (
      obj: void,
      args: { [key: string]: string },
      context: KsqDBContext,
      info: GraphQLResolveInfo
    ) => Promise<void>;
  };
}

export type KsqlDBGraphResolver = GraphQLFieldResolver<
  void,
  KsqDBContext,
  { [argName: string]: string }
>;

export type ResolverFields = {
  queryFields: GraphQLFieldConfigMap<any, any>;
  subscriptionFields: GraphQLFieldConfigMap<any, any>;
  mutationFields: GraphQLFieldConfigMap<any, any>;
};

export type KsqlDBRest = {
  statusCode: number,
  data: Array<{
    '@type': 'source_descriptions',
    statementText: string,
    sourceDescriptions: Array<KsqlDBResponse>,
    warnings: []
  }>
}
