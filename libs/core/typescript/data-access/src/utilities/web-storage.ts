import { createJSONStorage } from "jotai/utils";
import { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";

export const webStorage = createJSONStorage(
  () => localStorage
) as SyncStorage<unknown>;
