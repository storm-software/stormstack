import {
  MaybePromise,
  isAsyncIterable,
  isPromise
} from "@stormstack/core-shared-utilities";
import type {
  ApiClientResult,
  GeneratePatchFunction,
  LiveApiClientResult
} from "../types";
import { createLiveQueryPatchGenerator } from "./create-live-query-patch-generator";

type LiveQueryDeflatorApiClientResult = MaybePromise<
  AsyncIterableIterator<ApiClientResult | LiveApiClientResult> | ApiClientResult
>;

/**
 *  after-ware for wrapping execute in order to generate live query patches.
 */
export const createApplyLiveQueryPatchGenerator = <PatchPayload = unknown>(
  generatePatch: GeneratePatchFunction<PatchPayload>
) => {
  return (
    executionResult: LiveQueryDeflatorApiClientResult
  ): LiveQueryDeflatorApiClientResult => {
    const makePatch = createLiveQueryPatchGenerator(generatePatch);

    const handler = (
      result:
        | AsyncIterableIterator<ApiClientResult | LiveApiClientResult>
        | ApiClientResult
    ) => {
      if (isAsyncIterable(result)) {
        return makePatch(result);
      }
      return result;
    };

    if (isPromise(executionResult)) {
      return executionResult.then(handler);
    }

    return handler(executionResult);
  };
};
