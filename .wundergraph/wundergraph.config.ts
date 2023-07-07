import {
  configureWunderGraphApplication,
  cors,
  EnvironmentVariable,
  introspect,
  templates,
} from "@wundergraph/sdk";
import operations from "./wundergraph.operations";
import server from "./wundergraph.server";

const ratings = introspect.graphql({
  apiNamespace: "ratings",
  url: "https://patsullivan.org/api/ratings",
  subscriptionsUseSSE: true,
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  apis: [ratings],
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
    allowedOrigins:
      process.env.NODE_ENV === "production"
        ? ["https://patsullivan.org"]
        : [
            "http://localhost:3000",
            new EnvironmentVariable("WG_ALLOWED_ORIGIN"),
          ],
  },
  security: {
    enableGraphQLEndpoint:
      process.env.NODE_ENV !== "production" ||
      process.env.GITPOD_WORKSPACE_ID !== undefined,
  },
});
