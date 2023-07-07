import { createJSONStorage } from "jotai/utils";
import { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";

export const getWebStorage = <TValue>() => createJSONStorage<TValue>(
  () => localStorage
) as SyncStorage<TValue>;
