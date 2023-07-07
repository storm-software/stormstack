import { createRelayHooks } from "@open-system/core-data-access/hooks/relay-hooks";
import { Client } from "./client";

export const {
  RelayProvider,
  useSubscribeTo,
  useSerializablePreloadedQuery,
  useLiveQuery,
  useEnvironment,
} = createRelayHooks({ client: Client });
