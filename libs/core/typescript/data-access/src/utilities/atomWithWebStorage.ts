import { isDevelopment } from "@open-system/core-utilities";
import { WritableAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";
import { SetStateAction } from "../types";
import { webStorage } from "../utilities/web-storage";

export function atomWithWebStorage<TValue = unknown>(
  key: string,
  initialValue: TValue
): WritableAtom<TValue, [SetStateAction<TValue>], void> {
  const baseAtom: WritableAtom<TValue, [SetStateAction<TValue>], void> =
    atomWithStorage<TValue>(
      key,
      initialValue,
      webStorage as SyncStorage<TValue>
    );
  if (isDevelopment()) {
    baseAtom.debugPrivate = true;
  }

  /*const returnedAtom = atomWithBroadcast(key, baseAtom);
  if (isDevelopment()) {
    returnedAtom.debugPrivate = true;
  }*/

  return baseAtom;
}
