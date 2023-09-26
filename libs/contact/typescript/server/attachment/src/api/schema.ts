import { CloudflareServerBindingsContext } from "@stormstack/core-server-cloudflare/types";
import {
  GraphQLExecutionContext,
  GraphQLServerContext
} from "@stormstack/core-server-graphql/context";
import { createSchema } from "@stormstack/core-server-graphql/schema";
import { resolvers } from "../__generated__/graphql/resolvers";
import { typeDefs } from "../__generated__/graphql/schema.graphql";
import { ContactGraphQLInitialServerContext } from "../context/context";

export const schema = createSchema<
  ContactGraphQLInitialServerContext,
  GraphQLExecutionContext,
  GraphQLServerContext<
    ContactGraphQLInitialServerContext,
    GraphQLExecutionContext,
    CloudflareServerBindingsContext
  >
>({
  typeDefs, //"./src/__generated__/graphql/schema.graphql",
  resolvers
});
