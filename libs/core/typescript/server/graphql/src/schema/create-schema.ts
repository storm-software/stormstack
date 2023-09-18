import { IExecutableSchemaDefinition } from "@graphql-tools/schema";
import { GlobalServerContext } from "@open-system/core-server-application/context";
import {
  GraphQLSchemaWithContext,
  createSchema as createSchemaExt
} from "graphql-yoga";
import {
  GraphQLExecutionServerContext,
  GraphQLServerContext
} from "../context";

/*export const createSchema = <
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext,
  TServerContext extends GraphQLServerContext<
    TInitialContext,
    TActiveContext
  > = GraphQLServerContext<TInitialContext, TActiveContext>
>(
  opts: Omit<IExecutableSchemaDefinition<TServerContext>, "typeDefs"> & {
    typeDefs: UnnormalizedTypeDefPointer | UnnormalizedTypeDefPointer[];
  }
): GraphQLSchemaWithContext<TServerContext> => {
  const schema = loadSchemaSync(opts, {
    loaders: [new GraphQLFileLoader()]
  });

  return createSchemaExt<TServerContext>({
    typeDefs: parse(printSchema(schema)),
    resolvers: opts.resolvers
  });
};*/

export const createSchema = <
  TInitialContext extends GlobalServerContext = GlobalServerContext,
  TActiveContext extends GraphQLExecutionServerContext = GraphQLExecutionServerContext,
  TServerContext extends GraphQLServerContext<
    TInitialContext,
    TActiveContext
  > = GraphQLServerContext<TInitialContext, TActiveContext>
>(
  opts: IExecutableSchemaDefinition<TServerContext>
): GraphQLSchemaWithContext<TServerContext> => {
  return createSchemaExt<TServerContext>({
    typeDefs: opts.typeDefs,
    resolvers: opts.resolvers
  });
};
