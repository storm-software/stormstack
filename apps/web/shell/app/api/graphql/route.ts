/* eslint-disable react-hooks/rules-of-hooks */
// import { KafkaPubSubEngine } from "@open-system/core-typescript-data-access";
import { envelop, useEngine, useLogger, useSchema } from "@envelop/core";
import { useOpenTelemetry } from "@envelop/opentelemetry";
import { useSentry } from "@envelop/sentry";
import { addResolversToSchema } from "@graphql-tools/schema";
import { buildKsqlDBGraphQL } from "@open-system/core-typescript-kafka";
import "@sentry/tracing";
import { execute, parse, specifiedRules, subscribe, validate } from "graphql";
import {
  Request as HelixRequest,
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { NextRequest, NextResponse } from "next/server";

//import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
//import { createServer } from 'http';
//import { WebSocketServer } from 'ws';
//import { useServer } from 'graphql-ws/lib/use/ws';

/*export const pubsub = await KafkaPubSubEngine.create({
  topic: "blog.engagement.reaction.count",
  kafka: new Kafka({
    clientId: "web-app",
    brokers: [`192.168.1.18:9092`],
  }),
  groupIdPrefix: "web-app-group-1",
  producerConfig: {},
  consumerConfig: {},
});

const options = {
  hostname: process.env.ROOT_HOST,
  port: 8088,
};*/

/*
 * Creates an http2 session
 * this is used in conjunction with klip-15 to talk to the ksqlDB api
 */
/*const createSession = (): ClientHttp2Session | void => {
  try {
    const ksqlDBServer = `http://${options.hostname}:${options.port}`;
    const session = connect(ksqlDBServer);
    session.on("error", error => {
      // eslint-disable-next-line
      console.error(error);
    });
    return session;
  } catch (e) {
    // eslint-disable-next-line
    console.error(e.message);
  }
};
const session: ClientHttp2Session = createSession() as ClientHttp2Session;*/

/*const typeDefs = gql`
  type Subscription {
    receiveReaction: ReactionEvent!
  }
  type ReactionEvent {
    id: ID!
    userId: String!
    count: Int
    Type: String
  }
`;*/

/*const resolvers = {
  Subscription: {
    receiveReaction: {
      resolve: (payload: KafkaMessage) => {
        // what you publish will end up passing through here and to the client
        return payload.value;
      },
      subscribe: (_: any, args: any) => {
        // this is called from the client
        return pubsub.asyncIterator(["ReactionEventMessage"]);
      },
    },
  },
};*/

/*const { schemas, queryResolvers, subscriptionResolvers, mutationResolvers } =
  await generateGraphQL({ options });

  const server = new ApolloServer({
  schema: addResolversToSchema({
    schema: schemas,
    resolvers,
  }),
});
  */

//const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create our WebSocket server using the HTTP server we just set up.
/*const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
*/

export const runtime = "edge";

const { schemas, queryResolvers, subscriptionResolvers, mutationResolvers } =
  await buildKsqlDBGraphQL({
    options: {
      hostname: process.env.ROOT_HOST,
      port: 8088,
    },
  });

const getEnveloped = envelop({
  plugins: [
    useEngine({ parse, validate, specifiedRules, execute, subscribe }),
    useSchema(
      addResolversToSchema({
        schema: schemas,
        resolvers: {
          ...subscriptionResolvers,
          ...queryResolvers,
          ...mutationResolvers,
        },
      })
    ),
    useLogger(),
    useSentry({
      includeRawResult: true, // set to `true` in order to include the execution result in the metadata collected
      includeResolverArgs: true, // set to `true` in order to include the args passed to resolvers
      includeExecuteVariables: true, // set to `true` in order to include the operation variables values
      //appendTags: args => {}, // if you wish to add custom "tags" to the Sentry transaction created per operation
      // configureScope: (args, scope) => {}, // if you wish to modify the Sentry scope
      //skip: executionArgs => {} // if you wish to modify the skip specific operations
    }),
    useOpenTelemetry({
      resolvers: true, // Tracks resolvers calls, and tracks resolvers thrown errors
      variables: true, // Includes the operation variables values as part of the metadata collected
      result: true, // Includes execution result object as part of the metadata collected
    }),
  ],
});

export async function GET(request: NextRequest) {
  return request;
}

export async function POST(req: NextRequest) {
  const { parse, validate, contextFactory, execute, schema } = getEnveloped({
    req,
  });

  const body = await req.json();
  const request: HelixRequest = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.body ? body.query : null,
  };

  if (shouldRenderGraphiQL(request)) {
    new Response(
      renderGraphiQL({
        endpoint: "/api/graphql",
      })
    );
    return;
  }

  // Extract the GraphQL parameters from the request
  const { operationName, query, variables, extensions } =
    getGraphQLParameters(request);

  // Validate and execute the query
  const result = await processRequest({
    operationName,
    query,
    variables,
    request,
    extensions,
    schema,
    parse,
    validate,
    execute,
    contextFactory,
  });

  if (result.type === "RESPONSE") {
    // We set the provided status and headers and just the send the payload back to the client
    // result.headers.forEach(({ name, value }) => res.setHeader(name, value));

    return NextResponse.json(result.payload, {
      headers: result.headers.map((header: { name: string; value: string }) => [
        header.name,
        header.value,
      ]),
      status: result.status,
    });
  }
}
