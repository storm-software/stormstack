import { createApplyLiveQueryPatchGenerator } from "./create-apply-live-query-patch-generator";
import { generateJSONDiffPatch } from "./generate-json-diff-patch";

export const applyLiveQueryJSONDiffPatchGenerator =
  createApplyLiveQueryPatchGenerator(generateJSONDiffPatch);
