import { createRelayUtilities } from "@open-system/core-data-access/utilities/relay-utilities";
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
  createEnvironment,
} = createRelayUtilities({ client: Client });
