import {
  ContactApiServerContext,
  DB,
  builder,
} from "@open-system/contact-server-data-access";
import { UserContext } from "@open-system/core-server-data-access";
import { YogaServerInstance, createYoga } from "graphql-yoga";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

interface Env {
  DB: any;
}

// Create a Yoga instance with a GraphQL schema.
const yoga: YogaServerInstance<ContactApiServerContext, UserContext> =
  createYoga<ContactApiServerContext>({
    graphqlEndpoint: "graphql",
    schema: builder.toSchema(),
  });

const handler = {
  async fetch(request: any, env: Env, ctx: any) {
    try {
      // Create Kysely instance with kysely-d1
      const context = {
        env,
        ctx,
        database: new Kysely<DB>({
          dialect: new D1Dialect({ database: env.DB }),
        }),
      };

      return yoga.fetch(request, context as ContactApiServerContext);
    } catch (e: any) {
      return new Response(e?.message, { status: 500 });
    }
  },
};

export default handler;
