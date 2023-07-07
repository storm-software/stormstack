import { IsServer } from "@open-system/core-shared-utilities";
import { QueryResponseCache } from "relay-runtime";
import { CACHE_TTL } from "../types";

export const RelayResponseCache: QueryResponseCache | null = IsServer
  ? null
  : new QueryResponseCache({
      size: 100,
      ttl: CACHE_TTL,
    });
