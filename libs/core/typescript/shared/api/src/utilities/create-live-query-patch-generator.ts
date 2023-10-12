import { Repeater } from "@repeaterjs/repeater";
import {
  ApiClientResult,
  ApiClientResultStatus,
  GeneratePatchFunction,
  LiveApiClientResult,
  LivePatchApiClientResult,
  NO_DIFF_SYMBOL,
  PatchApiClientResult
} from "../types";

export const createLiveQueryPatchGenerator =
  <PatchPayload = unknown>(
    generatePatch: GeneratePatchFunction<PatchPayload>
  ) =>
  (source: AsyncIterableIterator<LiveApiClientResult>) =>
    new Repeater<
      LivePatchApiClientResult | ApiClientResult | PatchApiClientResult
    >(async (push, stop) => {
      const iterator = source[Symbol.asyncIterator]();
      stop.then(() => iterator.return?.());

      let previousValue: LiveApiClientResult["data"] | null = null;
      let revision = 1;

      let next: IteratorResult<LiveApiClientResult, void>;

      while ((next = await iterator.next()).done === false) {
        // if it is not live we simply forward everything :)
        if (!next.value.isLive) {
          await push(next.value);
          continue;
        }

        const valueToPublish: LivePatchApiClientResult = {
          status: ApiClientResultStatus.PENDING,
          errors: []
        };
        if (previousValue) {
          const currentValue = next.value.data ?? {};
          const patch = generatePatch(previousValue, currentValue);
          previousValue = currentValue;

          if (patch === NO_DIFF_SYMBOL) {
            continue;
          }

          valueToPublish.patch = patch;
          revision++;
        } else {
          previousValue = next.value.data ?? {};
          if ("data" in next.value) {
            valueToPublish.data = previousValue;
          }
        }

        if ("errors" in next.value) {
          valueToPublish.errors = next.value.errors;
        }
        if ("status" in next.value) {
          valueToPublish.status = next.value.status;
        }
        if ("headers" in next.value) {
          valueToPublish.headers = next.value.headers;
        }

        valueToPublish.revision = revision;

        if (
          !valueToPublish.status ||
          valueToPublish.status === ApiClientResultStatus.PENDING
        ) {
          valueToPublish.status = valueToPublish.errors
            ? ApiClientResultStatus.ERROR
            : ApiClientResultStatus.SUCCESS;
        }

        await push(valueToPublish);
      }

      stop();
    });
