import {
  ContactApiServerContext,
  builder,
} from "@open-system/contact-server-graphql";
import { initContextCache } from "@pothos/core";
import {
  YogaInitialContext,
  YogaServerInstance,
  createYoga,
} from "graphql-yoga";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

declare global {
  namespace GraphQLModules {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface GlobalContext extends ContactApiServerContext {}
  }
}

interface Env {
  DB: any;
}

// Create a Yoga instance with a GraphQL schema.
const yoga: YogaServerInstance<ContactApiServerContext, {}> =
  createYoga<ContactApiServerContext>({
    graphqlEndpoint: "graphql",
    schema: builder.toSchema(),
    context: () => ({
      user: {
        id: 1,
      },
      ...initContextCache(),
    }),
  });

const handler = {
  async fetch(request: any, env: Env, ctx: YogaInitialContext) {
    try {
      // Create Kysely instance with kysely-d1
      const context = {
        user: {
          id: 1,
        },
        ...ctx,
        env,
        database: new Kysely<DB>({
          dialect: new D1Dialect({ database: env.DB }),
        }),
      };

      return yoga.fetch(request, context);
    } catch (e: any) {
      return new Response(e?.message, { status: 500 });
    }
  },
};

export default handler;
