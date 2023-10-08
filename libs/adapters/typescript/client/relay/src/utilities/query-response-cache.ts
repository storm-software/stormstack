import { isRuntimeServer } from "@stormstack/core-shared-utilities";
import { QueryResponseCache } from "relay-runtime";

let responseCache: QueryResponseCache | null = null;
export const getRelayResponseCache = (config?: {
  size?: number;
  ttl?: number;
}) => {
  if (!responseCache && !isRuntimeServer()) {
    const size = config?.size ?? 800;
    const ttl = config?.ttl ?? 5000;

    responseCache = new QueryResponseCache({
      size,
      ttl
    });
  }

  return responseCache;
};
