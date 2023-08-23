import { parseInteger } from "@open-system/core-shared-utilities/common/integer-fns";
import InfisicalClient from "infisical-node";
import { DEFAULT_CACHE_TTL } from "./types";

let client!: InfisicalClient;
export const getInfisicalClient = (token: string) => {
  if (client) {
    return client;
  }

  client = new InfisicalClient({
    token,
    cacheTTL: parseInteger(process.env.INFISICAL_CACHE_TTL, DEFAULT_CACHE_TTL)
  });

  return client;
};
