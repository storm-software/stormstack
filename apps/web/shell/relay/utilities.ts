import { createRelayUtilities } from "@stormstack/core-shared-data-access";
import { Client } from "./client";

export const {
  writePreloadedQueryToCache,
  fetchQuery,
  fetchSSRQuery,
  fetchSSGQuery,
  loadSerializableQuery,
  subscribe,
  subscribeTo,
  createNetwork,
  getEnvironment,
  initEnvironment,
  createEnvironment
} = createRelayUtilities({ client: Client });
