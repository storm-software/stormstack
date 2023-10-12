import { applyJSONDiffPatch } from "./apply-json-diff-patch";
import { createApplyLiveQueryPatch } from "./create-apply-live-query-patch";

export const applyLiveQueryJSONDiffPatch =
  createApplyLiveQueryPatch(applyJSONDiffPatch);
