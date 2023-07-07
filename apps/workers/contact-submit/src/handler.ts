import { createSchema, createYoga } from "graphql-yoga";

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String!
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello World!",
      },
    },
  }),
});

export default { fetch: yoga.fetch };
