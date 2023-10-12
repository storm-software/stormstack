import { Repeater } from "@repeaterjs/repeater";
import { StormError } from "@stormstack/core-shared-utilities";
import { ApiErrorCode } from "../errors";
import {
  ApiClientResultStatus,
  ApplyPatchFunction,
  LivePatchApiClientResult
} from "../types";

/**
 * Create a middleware generator function for applying live query patches on the client.
 */
export const createApplyLiveQueryPatch =
  <PatchPayload = any>(
    /* Function which is used for generating the patches */
    applyPatch: ApplyPatchFunction<PatchPayload>
  ) =>
  <
    TExecutionResult extends LivePatchApiClientResult = LivePatchApiClientResult
  >(
    source: AsyncIterable<TExecutionResult>
  ) =>
    new Repeater<TExecutionResult>(async (push, stop) => {
      const iterator = source[Symbol.asyncIterator]();
      stop.then(() => iterator.return?.());
      let mutableData: any | null = null;
      let lastRevision = 0;
      let next: IteratorResult<TExecutionResult>;

      while ((next = await iterator.next()).done === false) {
        // no revision means this is no live query patch.
        if ("revision" in next.value && next.value.revision) {
          const valueToPublish: LivePatchApiClientResult = {
            status: ApiClientResultStatus.PENDING
          };

          if (next.value.revision === 1) {
            if (!next.value.data) {
              throw new StormError(
                ApiErrorCode.invalid_response,
                "Missing data."
              );
            }
            valueToPublish.data = next.value.data;
            mutableData = next.value.data;
            lastRevision = 1;
          } else {
            if (!mutableData) {
              throw new StormError(
                ApiErrorCode.invalid_response,
                "No previousData available."
              );
            }
            if (!next.value.patch) {
              throw new StormError(
                ApiErrorCode.invalid_response,
                "Missing patch."
              );
            }
            if (lastRevision + 1 !== next.value.revision) {
              throw new StormError(
                ApiErrorCode.invalid_response,
                "Wrong revision received."
              );
            }

            mutableData = applyPatch(
              mutableData as Record<string, unknown>,
              next.value.patch
            );
            valueToPublish.data = { ...mutableData } as Record<string, unknown>;

            lastRevision++;
          }

          if (next.value.error) {
            valueToPublish.error = next.value.error;
          }
          if (next.value.status) {
            valueToPublish.status = next.value.status;
          }

          await push(valueToPublish as TExecutionResult);
          continue;
        }

        await push(next.value as TExecutionResult);
      }

      stop();
    });
