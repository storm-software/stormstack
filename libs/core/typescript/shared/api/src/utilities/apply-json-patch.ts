import type { Operation } from "fast-json-patch";
import fastJsonPatch from "fast-json-patch";
import { ApplyPatchFunction } from "../types";

export const applyJSONPatch: ApplyPatchFunction<Array<Operation>> = (
  previous,
  patch
): Record<string, unknown> => {
  const result = fastJsonPatch.applyPatch(previous, patch, true, false);
  return result.newDocument;
};
