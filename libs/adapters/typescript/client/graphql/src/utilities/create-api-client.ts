import { ApiClient } from "@stormstack/core-client-api";
import { ClientPublicEnvManager } from "@stormstack/core-client-env";
import { ClientPrivateEnvManager } from "@stormstack/core-client-env/server";
import { isRuntimeServer } from "@stormstack/core-shared-utilities";
import { GraphQLSerializationMiddleware } from "../middleware/graphql-serialization-middleware";

let client: ApiClient;
export function getApiClient(): ApiClient {
  if (isRuntimeServer() || !client) {
    const _client = new ApiClient(
      isRuntimeServer()
        ? new ClientPrivateEnvManager()
        : new ClientPublicEnvManager(),
      {
        middleware: [GraphQLSerializationMiddleware]
      }
    );

    if (!isRuntimeServer()) {
      client = _client;
    }

    return _client;
  }

  return client;
}
