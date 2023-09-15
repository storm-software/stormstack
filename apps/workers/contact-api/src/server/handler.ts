/* eslint-disable @typescript-eslint/no-explicit-any */
import { InitialServerContext } from "@open-system/core-server-application";
import { CloudflareServerBindings } from "@open-system/core-server-cloudflare/types";
import {
  GraphQLActiveServerContext,
  GraphQLServerContext
} from "@open-system/core-server-graphql/context";
import { createServer } from "./server";

/*declare global {
  namespace GraphQLModules {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface GlobalContext extends ContactApiServerContext {}
  }
}*/

export interface Env extends CloudflareServerBindings {
  DB: any;
}

// Create a Yoga instance with a GraphQL schema.
/*const yoga: YogaServerInstance<ContactApiServerContext, {}> =
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
};*/

/*const context = createGraphQLServerContext({
  injector: Injector,
  operation: "contact-graphql"
});*/

export const handler = async (
  request: Request,
  env: Env,
  context: Partial<
    GraphQLServerContext<InitialServerContext, GraphQLActiveServerContext>
  >
) => {
  try {
    const server = await createServer();

    return server.fetch(request as any, env as any, context);
  } catch (e) {
    return new Response((e as Error)?.message, {
      status: 500,
      ...(e as Error)
    });
  }
};

// export default { fetch: yoga.fetch };
