import { envAtom } from "@stormstack/core-client-state";
import { atom, Getter } from "jotai";
import { GraphQLClient } from "../client";

export const graphQLClientAtom = atom<GraphQLClient>((get: Getter) => {
  const env = get(envAtom);

  const client = new GraphQLClient(env);
  return client;
});
