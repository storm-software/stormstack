import { Delta, ObjectHashFunction, diff } from "@n1ru4l/json-patch-plus";
import { JsonParser } from "@stormstack/core-shared-serialization";
import { GeneratePatchFunction, NO_DIFF_SYMBOL } from "../types";

/**
 * We use common connection/pagination fields for
 * generating more efficient list patches.
 */
const objectHash: ObjectHashFunction = (obj: any) => {
  if (obj["__typename"] != null && obj["id"] != null) {
    return `${obj["__typename"]}:${obj["id"]}`;
  } else if (obj["id"] != null) {
    return obj["id"];
  } else if (obj["node"] != null) {
    return objectHash(obj["node"]);
  } else if (obj["cursor"] != null) {
    return obj["cursor"];
  } else if (obj["_id"] != null) {
    return obj["_id"];
  } else if (obj["__id"] != null) {
    return obj["__id"];
  }
  return JsonParser.stringify(obj);
};

export const generateJSONDiffPatch: GeneratePatchFunction<Delta> = (
  left,
  right
) => {
  const delta = diff(
    { left, right },
    {
      objectHash
    }
  );
  if (delta === undefined) {
    return NO_DIFF_SYMBOL;
  }

  return delta;
};
