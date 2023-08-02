import {
  configureWunderGraphApplication,
  cors,
  introspect,
  templates,
} from "@wundergraph/sdk";
import { ServerConfigManager } from "../libs/core/typescript/server/utilities/src";
import operations from "./wundergraph.operations";
import server from "./wundergraph.server";

const contact = introspect.graphql({
  apiNamespace: "contact",
  url: "https://contact-api.open-system.workers.dev/graphql",
  subscriptionsUseSSE: true,
});

/*const ratings = introspect.graphql({
  apiNamespace: "ratings",
  url: "https://patsullivan.org/api/ratings",
  subscriptionsUseSSE: true,
});*/

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  apis: [contact],
  server,
  operations,
  generate: {
    codeGenerators: [
      {
        templates: [...templates.typescript.all],
        path: "./generated",
      },
    ],
  },
  cors: {
    ...cors.allowAll,
    allowedOrigins: ServerConfigManager.instance.gateway.allowedOrigins,
  },
  security: {
    enableGraphQLEndpoint: !ServerConfigManager.instance.isProduction,
  },
});
