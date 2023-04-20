import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { generateGraphQL } from "@confluentinc/ksqldb-graphql";
import { addResolversToSchema } from "@graphql-tools/schema";
import { connect } from "http2";
import { NextRequest } from "next/server";

const session = connect("http://ksqldb-server:8088");
const options = {
  hostname: "ksqldb-server",
  port: 8088,
};

const { schemas, queryResolvers, subscriptionResolvers, mutationResolvers } =
  await generateGraphQL({ options });

const server = new ApolloServer({
  schema: addResolversToSchema({
    schema: schemas,
    resolvers: {
      Subscription: subscriptionResolvers,
      Query: queryResolvers,
      Mutation: mutationResolvers,
    },
  }),
});

// req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async req => ({
    req,
    ksqlDB: {
      options,
      session,
    },
  }),
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
