import { GraphQLLiveDirective } from "@envelop/live-query";
import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import { camelCase, camelCaseTransformMerge } from "change-case";
import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  isInputType,
  printSchema,
} from "graphql";
import { RequestOptions } from "http";
import { KsqlDBMutation, Missing } from "./graphQLObjectTypes";
import { runCommand } from "./requester";
import { ResolverGenerator } from "./resolvers";
import {
  Config,
  Field,
  KSqlDBEntities,
  KsqlDBResponse,
  ResolverFields,
  SkipStreamList,
} from "./type/types";

const TypeMap = {
  STRING: GraphQLString,
  VARCHAR: GraphQLString,
  BIGINT: GraphQLFloat, // the BIGINT that is given back is larger than graphql supports, so it has to be a float
  DOUBLE: GraphQLFloat,
  INTEGER: GraphQLFloat,
  ARRAY: {
    STRING: new GraphQLList(GraphQLString),
    VARCHAR: new GraphQLList(GraphQLString),
    BIGINT: new GraphQLList(GraphQLFloat),
    INTEGER: new GraphQLList(GraphQLFloat),
    DOUBLE: new GraphQLList(GraphQLFloat),
  },
  STRUCT: {}, // MemberSchema exclude not excluding this?
};

const setSchemaType = (accum: KSqlDBEntities, field: Field): void => {
  if (TypeMap[field.schema.type] == null) {
    // eslint-disable-next-line
    ConsoleLogger.error(`type ${field.schema.type} is not supported`);
    return;
  }

  if (field.schema.memberSchema?.type != null) {
    const scalarType: GraphQLScalarType = TypeMap[field.schema.type][
      field.schema.memberSchema.type
    ] as GraphQLScalarType;
    accum[field.name] = {
      type: scalarType,
    };
  } else {
    const scalarType: GraphQLScalarType = TypeMap[
      field.schema.type
    ] as GraphQLScalarType;
    accum[field.name] = {
      type: scalarType,
    };
  }
};

const buildSchemaObject = (
  accum: KSqlDBEntities,
  field: Field
): KSqlDBEntities => {
  if (field.schema.fields == null) {
    setSchemaType(accum, field);
  } else if (Array.isArray(field.schema.fields)) {
    const fields = field.schema.fields.reduce(buildSchemaObject, {});
    if (accum[field.name] == null) {
      accum[field.name] = {
        type: new GraphQLObjectType({
          name: field.name,
          fields: fields,
        }),
      };
    } else {
      // eslint-disable-next-line
      ConsoleLogger.warn(`${field.name} already exists.`);
    }
  }
  return accum;
};

export const generateSchemaFromKsql = ({
  name,
  fields,
}: KsqlDBResponse): GraphQLObjectTypeConfig<void, void> => {
  const schemaFields = fields.reduce(buildSchemaObject, {});
  return {
    name,
    fields: schemaFields,
  };
};

// TODO support nested objects for resolving
const generateGraphQLArgs = (fields: any): any =>
  Object.keys(fields).reduce((accum: any, filter: any) => {
    if (isInputType(fields[filter].type)) {
      accum[filter] = fields[filter];
    }
    return accum;
  }, {});

function generateQueries(
  streams: Array<KsqlDBResponse>,
  subscriptionFields: any
) {
  return (accum: { [name: string]: any }, query: any): any => {
    const schemaType = new GraphQLObjectType(query);
    const ksqlDBQuery = streams.find(stream => stream.name === query.name);
    // if a ksqlDB query is writing something, it's materialized, so it qualifies as a query
    if (ksqlDBQuery != null && ksqlDBQuery.writeQueries.length > 0) {
      const args = generateGraphQLArgs(query.fields);
      if (subscriptionFields[query.name] != null) {
        accum[query.name] = subscriptionFields[query.name];
      } else {
        accum[query.name] = {
          type: schemaType,
          args,
        };
      }
    }
    return accum;
  };
}

// anything can be a subscription
function generateSubscription(accum: { [name: string]: any }, query: any): any {
  const schemaType = new GraphQLObjectType(query);
  const args = generateGraphQLArgs(query.fields);
  accum[query.name] = {
    type: schemaType,
    args,
  };
  return accum;
}

function generateMutations(accum: { [name: string]: any }, query: any): any {
  const args = generateGraphQLArgs(query.fields);
  accum[query.name] = {
    type: KsqlDBMutation,
    args,
  };
  return accum;
}

export const generateSchemaAndFields = (
  streams: Array<KsqlDBResponse>
): {
  schema: GraphQLSchema;
  fields: ResolverFields;
} => {
  const schemas: GraphQLObjectTypeConfig<void, void>[] = [];
  for (const stream of streams) {
    const nextSchema = generateSchemaFromKsql(stream);
    ConsoleLogger.info(JSON.stringify(nextSchema));

    schemas.push(nextSchema);
  }

  const subscriptionFields = schemas.reduce(generateSubscription, {});
  const mutationFields = schemas.reduce(generateMutations, {});

  let queryFields = schemas.reduce(
    generateQueries(streams, subscriptionFields),
    {}
  );
  // if you have no materialized views, graphql won't work, so default to subscriptions, already logged out this won't work
  // why default? http://spec.graphql.org/June2018/#sec-Schema
  if (Object.keys(queryFields).length === 0) {
    // eslint-disable-next-line
    ConsoleLogger.error(
      "No materialized views have been registered.",
      "Only subscriptions and mutations will be work properly.",
      "Defaulting `type Query` to null scalar since it is required by graphQL."
    );
    queryFields = { KsqlDBGraphQLError: Missing };
  }

  return {
    schema: new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: queryFields,
      }),
      subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: subscriptionFields,
      }),
      mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: mutationFields,
      }),
      directives: [GraphQLLiveDirective],
    }),
    fields: {
      queryFields: Object.keys(queryFields)
        .filter(key => {
          return queryFields[key] !== Missing;
        })
        .reduce((accum: any, key: string) => {
          accum[key] = queryFields[key];
          return accum;
        }, {}),
      subscriptionFields,
      mutationFields,
    },
  };
};

const formatName = (name: string | null): string => {
  return camelCase(name ?? "", { transform: camelCaseTransformMerge });
};

const formatField = (field: Field): Field | null => {
  return field
    ? {
        ...field,
        name: formatName(field.name),
        /*schema: field.schema
          ? {
              ...field.schema,
              fields: field.schema?.fields
                ? field.schema?.fields?.map(f => formatField(f))
                : [],
            }
          : null,*/
      }
    : null;
};

const formatResponses = (
  responses: Array<KsqlDBResponse>
): Array<KsqlDBResponse> => {
  return responses.reduce(
    (ret: Array<KsqlDBResponse>, response: KsqlDBResponse) => {
      if (!SkipStreamList.includes(response.name.toLowerCase()))
        ret.push({
          ...response,
          name: formatName(response.name),
          fields: response.fields.map(f => formatField(f)),
        });

      return ret;
    },
    []
  );
};

const schemas = async (
  options: RequestOptions
): Promise<{ schema: GraphQLSchema; fields: ResolverFields } | undefined> => {
  try {
    const response = await runCommand(
      "show tables extended; show streams extended;",
      options
    );
    ConsoleLogger.info(response);
    if (
      !response?.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      throw new Error(
        `No response received from ksql server ${options.hostname}:${options.port}`
      );
    }

    const streams: Array<KsqlDBResponse> = response.data[0].sourceDescriptions;
    return generateSchemaAndFields(
      formatResponses(streams.concat(response.data[1].sourceDescriptions))
    );

    /*const streams: Array<KsqlDBResponse> = formatResponses(
      response.data[0].sourceDescriptions
    );
    if (streams.length === 0) {
      throw new Error(
        `No materialized tables exist on ksql server ${options.hostname}:${options.port}`
      );
    }
    //if (response.data.length === 1) {
      return generateSchemaAndFields(streams);
   /* }

    return generateSchemaAndFields(
      streams.concat(formatResponses(response.data[1].sourceDescriptions))
    );*/
  } catch (e) {
    ConsoleLogger.error("Could not generate schemas");
    ConsoleLogger.exception(e as Error);
  }
};

export function buildKsqlDBGraphQL({ options }: Config): Promise<{
  schemas: any;
  queryResolvers: any;
  subscriptionResolvers: any;
  mutationResolvers: any;
}> {
  return new Promise(resolve => {
    (async function run(): Promise<void> {
      try {
        const result = await schemas(options);
        if (result) {
          // eslint-disable-next-line
          ConsoleLogger.info(printSchema(result.schema));
          const { queryResolvers, subscriptionResolvers, mutationResolvers } =
            new ResolverGenerator(result.fields);
          resolve({
            schemas: result.schema,
            queryResolvers,
            subscriptionResolvers,
            mutationResolvers,
          });
        } else {
          throw new Error("Unable to create schemas and resolvers");
        }
      } catch (e) {
        ConsoleLogger.exception(e as Error);
        throw new Error(e as any);
      }
    })();
  });
}

