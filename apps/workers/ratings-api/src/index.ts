import { createSchema, createYoga } from "graphql-yoga";

const yoga = createYoga({
  graphqlEndpoint: "graphql",

  schema: createSchema({
    typeDefs: /* GraphQL */ `
      interface IRating {
        contentId: String
        rate: Float
        count: Int
      }

      type Rating implements IRating {
        contentId: String
        rate: Float
        count: Int
      }

      type Query {
        rating(contentId: String): Rating
      }

      type Mutation {
        updateRating(rate: Float): Float
      }

      type Subscription {
        countdown(from: Int!): Int!
      }
    `,
    resolvers: {
      Query: {
        rating: (contentId: string) => {
          if (contentId === "home") {
            return { contentId, rate: 4.5, count: 50 };
          } else {
            return { contentId: "Other", rating: 3.2, count: 45 };
          }
        },
      },
      Mutation: {
        updateRating: (rate: number) => {
          return rate;
        },
      },
      Subscription: {
        countdown: {
          // This will return the value on every 1 sec until it reaches 0
          subscribe: async function* (_, { from }) {
            for (let i = from; i >= 0; i--) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              yield { countdown: i };
            }
          },
        },
      },
    },
  }),
});

self.addEventListener("fetch", yoga);
