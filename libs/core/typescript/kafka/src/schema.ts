import { GraphQLLiveDirective } from "@envelop/live-query";
import { pascalCase } from "change-case";
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
} from "./type/definition";

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
    console.error(`type ${field.schema.type} is not supported`);
    return;
  }

  if (field.schema.memberSchema?.type != null) {
    const sclarType: GraphQLScalarType = TypeMap[field.schema.type][
      field.schema.memberSchema.type
    ] as GraphQLScalarType;
    accum[field.name] = {
      type: sclarType,
    };
  } else {
    const sclarType: GraphQLScalarType = TypeMap[
      field.schema.type
    ] as GraphQLScalarType;
    accum[field.name] = {
      type: sclarType,
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
    if (accum[formatName(field.name)] == null) {
      accum[formatName(field.name)] = {
        type: new GraphQLObjectType({
          name: formatName(field.name),
          fields: fields,
        }),
      };
    } else {
      // eslint-disable-next-line
      console.warn(`${formatName(field.name)} already exists.`);
    }
  }
  return accum;
};

/*const formatEntities = (entities: KSqlDBEntities): KSqlDBEntities => {
  return Object.keys(entities).reduce((ret: KSqlDBEntities, key: string) => {
    const entity = (entities as any)[key];
    if (entity) {
    (ret as any)[formatName(key)] = {
      type: new GraphQLObjectType({ name: formatName(entity.name), fields: entity.fields && entity.fields.length formatFields(entity.fields) })
    };
  }

    return ret;
  }, {});
};

const formatFields = (fields: KSqlDBEntities): KSqlDBEntities => {
  if (fields != null) {
    return fields..map((f: Field) => formatField(f));
  }

  return fields;
};

const formatField = (field: Field): Field => {
  if (field?.schema?.fields) {
    field.schema.fields = formatFields(field.schema.fields);
  }

  field.name = formatName(field.name);
  return field;
};*/

const formatName = (name: string | null): string => {
  return pascalCase(name ?? "");
};

export const generateSchemaFromKsql = ({
  name,
  fields,
}: KsqlDBResponse): GraphQLObjectTypeConfig<void, void> => {
  const schemaFields = fields.reduce(buildSchemaObject, {});
  return {
    name: formatName(name),
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
    console.log("### first ");
    const first = stream;
    console.log(first);
    const second = generateSchemaFromKsql(first);
    console.log("### second ");
    console.log(second);
    schemas.push(second);
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
    console.error(
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

const schemas = async (
  options: RequestOptions
): Promise<{ schema: GraphQLSchema; fields: ResolverFields } | undefined> => {
  const ksql = "show streams extended; show tables extended;";
  try {
    const response = await runCommand(ksql, options);
    const streams: Array<KsqlDBResponse> = response.data[0].sourceDescriptions;
    const tables: Array<KsqlDBResponse> = response.data[1].sourceDescriptions;

    if (streams.length === 0) {
      throw new Error(
        `No ksql tables exist on ksql server ${options.hostname}:${options.port}`
      );
    }

    return generateSchemaAndFields(streams.concat(tables));
  } catch (e) {
    console.error(`Could not generate schemas:`, (e as any)?.message);
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
          console.log(printSchema(result.schema));
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
        throw new Error(e as any);
      }
    })();
  });
}

