import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import {
  UnnormalizedTypeDefPointer,
  loadSchemaSync
} from "@graphql-tools/load";
import { IExecutableSchemaDefinition } from "@graphql-tools/schema";
import { UserContext } from "@open-system/core-server-application/types";
import { IEntity } from "@open-system/core-server-domain/types";
import { parse, printSchema } from "graphql";
import {
  GraphQLSchemaWithContext,
  createSchema as createSchemaExt
} from "graphql-yoga";
import { GraphQLServerContext } from "../types";

export const createSchema = <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext,
  TServerContext extends GraphQLServerContext<
    TEntities,
    TUser
  > = GraphQLServerContext<TEntities, TUser>
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
};
