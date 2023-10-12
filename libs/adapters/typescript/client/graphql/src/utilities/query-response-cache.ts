import { isRuntimeServer } from "@stormstack/core-shared-utilities";
import { ApiClientResultCache } from "./api-client-result-cache";

let responseCache: ApiClientResultCache | null = null;
export const getRelayResponseCache = (config?: {
  size?: number;
  ttl?: number;
}) => {
  if (!responseCache && !isRuntimeServer()) {
    const size = config?.size ?? 800;
    const ttl = config?.ttl ?? 5000;

    responseCache = new ApiClientResultCache(size, ttl);
  }

  return responseCache;
};
