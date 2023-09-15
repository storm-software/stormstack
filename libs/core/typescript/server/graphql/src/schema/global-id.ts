import {
  base64,
  unbase64
} from "@open-system/core-server-utilities/create-string-hash";
import { GraphQLID } from "graphql";
import { ResolvedGlobalId } from "../types";

/**
 * Takes a type name and an ID specific to that type name, and returns a
 * "global ID" that is unique among all types.
 */
export function toGlobalId(type: string, id: string | number): string {
  return base64([type, GraphQLID.serialize(id)].join(":"));
}

/**
 * Takes the "global ID" created by toGlobalID, and returns the type name and ID
 * used to create it.
 */
export function fromGlobalId(globalId: string): ResolvedGlobalId {
  const unbasedGlobalId = unbase64(globalId);
  const delimiterPos = unbasedGlobalId.indexOf(":");
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1)
  };
}
