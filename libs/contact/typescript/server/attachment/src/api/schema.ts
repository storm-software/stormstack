import { CloudflareServerBindingsContext } from "@open-system/core-server-cloudflare/types";
import {
  GraphQLActiveServerContext,
  GraphQLServerContext
} from "@open-system/core-server-graphql/context";
import { createSchema } from "@open-system/core-server-graphql/schema";
import { resolvers } from "../__generated__/graphql/resolvers";
import { typeDefs } from "../__generated__/graphql/schema.graphql";
import { ContactGraphQLInitialServerContext } from "../context/context";

export const schema = createSchema<
  ContactGraphQLInitialServerContext,
  GraphQLActiveServerContext,
  GraphQLServerContext<
    ContactGraphQLInitialServerContext,
    GraphQLActiveServerContext,
    CloudflareServerBindingsContext
  >
>({
  typeDefs, //"./src/__generated__/graphql/schema.graphql",
  resolvers
});
