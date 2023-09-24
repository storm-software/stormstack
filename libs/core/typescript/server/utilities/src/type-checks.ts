import { isSet } from "@open-system/core-shared-utilities/common/type-checks";
import { Body as PonyfillBody } from "@whatwg-node/node-fetch";

export const isPonyfillBody = (value: any): value is PonyfillBody => {
  return isSet(value) && value instanceof PonyfillBody && !!value.contentType;
};
