import { isDevelopment } from "@open-system/core-utilities";
import { WritableAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";
import { SetStateActionWithReset } from "../types";
import { webStorage } from "../utilities/web-storage";
import { atomWithBroadcast } from "./atomWithBroadcast";
import { isAtom } from "../utilities/type-checks";

export function atomWithWebStorage<TValue = unknown>(
  key: string,
  initialValueOrBaseAtom:
    | TValue
    | WritableAtom<TValue, [SetStateActionWithReset<TValue>], void>
) {
  const baseAtom: WritableAtom<TValue, [SetStateActionWithReset<TValue>], void> = isAtom(initialValueOrBaseAtom)
  ? initialValueOrBaseAtom : atomWithStorage<TValue>(
    key,
    initialValueOrBaseAtom,
    webStorage as SyncStorage<TValue>
  );
  if (isDevelopment()) {
    baseAtom.debugPrivate = true;
  }

  const returnedAtom = atomWithBroadcast(
    key,
    baseAtom
  );
  if (isDevelopment()) {
    returnedAtom.debugPrivate = true;
  }

  return returnedAtom;
}
