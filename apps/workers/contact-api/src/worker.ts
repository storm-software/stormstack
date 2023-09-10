import {
  IContactAttachmentEntity,
  IContactEntity,
  createContactGraphQLServerContext,
  schema
} from "@open-system/contact-server-attachment";
import { UserContext } from "@open-system/core-server-application/types";
import { createGraphQLHandler } from "@open-system/core-server-graphql/server/handler";
import { Injector } from "@open-system/core-shared-injection";

/*declare global {
  namespace GraphQLModules {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface GlobalContext extends ContactApiServerContext {}
  }
}*/

interface Env {
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

const context = createContactGraphQLServerContext({
  injector: Injector,
  operation: "contact-graphql"
});

const yoga = await createGraphQLHandler<
  Array<IContactEntity | IContactAttachmentEntity>,
  UserContext
>({
  context,
  schema,
  injector: Injector,
  serviceConfig: []
});

export default { fetch: yoga.fetch };
