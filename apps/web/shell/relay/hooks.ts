import { createRelayHooks } from "@open-system/core-client-data-access";
import { Client } from "./client";

export const {
  RelayProvider,
  useSubscribeTo,
  useSerializablePreloadedQuery,
  useLiveQuery,
  useEnvironment,
} = createRelayHooks({ client: Client });
