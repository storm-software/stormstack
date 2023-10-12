import { ClientPublicEnvManager } from "@stormstack/core-client-env";
import { useMemo } from "react";
import { GraphQLClient, GraphQLClientOptions } from "../client";

export const useGraphQLClient = (options?: GraphQLClientOptions) => {
  const client = useMemo(
    () => new GraphQLClient(new ClientPublicEnvManager(), options),
    [options]
  );

  return client;
};
