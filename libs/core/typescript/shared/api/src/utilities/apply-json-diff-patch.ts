import { Delta, patch } from "@n1ru4l/json-patch-plus";
import { ApplyPatchFunction } from "../types";

export const applyJSONDiffPatch: ApplyPatchFunction<Delta> = (
  left,
  delta
): Record<string, unknown> =>
  patch({
    left,
    delta
  });
