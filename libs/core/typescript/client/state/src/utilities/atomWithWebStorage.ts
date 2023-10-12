import { JsonParser } from "@stormstack/core-shared-serialization";
import { isDevelopment, isFunction } from "@stormstack/core-shared-utilities";
import { Getter, Setter, WritableAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SetStateAction } from "../types";
import { getWebStorage } from "../utilities/web-storage";
import { atomWithBroadcast } from "./atomWithBroadcast";

export function atomWithWebStorage<TValue = unknown>(
  key: string,
  initialValue: TValue
): WritableAtom<TValue, [SetStateAction<TValue>], void> {
  const serialized = JsonParser.stringify(initialValue);

  const baseAtom: WritableAtom<string, [SetStateAction<string>], void> =
    atomWithStorage(key, serialized, getWebStorage());
  if (isDevelopment()) {
    baseAtom.debugPrivate = true;
  }

  const broadcastAtom = atomWithBroadcast<string>(key, serialized);
  if (isDevelopment()) {
    broadcastAtom.debugPrivate = true;
  }

  const returnedAtom = atom<TValue, [SetStateAction<TValue>], void>(
    (get: Getter) => JsonParser.parse(get(baseAtom)),
    (get: Getter, set: Setter, update: SetStateAction<TValue>) => {
      let nextValue!: TValue;
      if (isFunction(update)) {
        nextValue = update(get(baseAtom)) as TValue;
      } else {
        nextValue = update as TValue;
      }

      const nextSerialized = JsonParser.stringify(nextValue);

      set(baseAtom, nextSerialized);
      set(broadcastAtom, nextSerialized);
    }
  );
  if (isDevelopment()) {
    returnedAtom.debugPrivate = true;
  }

  return returnedAtom;
}
