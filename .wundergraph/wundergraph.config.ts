import {
  configureWunderGraphApplication,
  cors,
  EnvironmentVariable,
  introspect,
} from "@wundergraph/sdk";
import operations from "./wundergraph.operations";
import server from "./wundergraph.server";

const countries = introspect.graphql({
  apiNamespace: "countries",
  url: "https://countries.trevorblades.com/",
});

const spaceX = introspect.graphql({
  apiNamespace: "spacex",
  url: "https://spacex-api.fly.dev/graphql/",
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  apis: [countries, spaceX],
  server,
  operations,
  generate: {
    codeGenerators: [],
  },
  cors: {
    ...cors.allowAll,
    allowedOrigins:
      process.env.NODE_ENV === "production"
        ? ["http://localhost:3000"]
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
