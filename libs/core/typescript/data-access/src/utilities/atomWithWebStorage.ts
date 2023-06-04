import {
  DateTime,
  isDevelopment,
  isFunction,
  isObject,
} from "@open-system/core-utilities";
import { Getter, Setter, WritableAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SetStateAction } from "../types";
import { getWebStorage } from "../utilities/web-storage";
import { atomWithBroadcast } from "./atomWithBroadcast";
import { deserialize, serialize } from "./serialization";


export function atomWithWebStorage<TValue = unknown>(
  key: string,
  initialValue: TValue
): WritableAtom<TValue, [SetStateAction<TValue>], void> {
  const serialized = serialize<TValue>(initialValue);

  const baseAtom: WritableAtom<TValue, [SetStateAction<TValue>], void> =
    atomWithStorage<TValue>(key, serialized, getWebStorage());
  if (isDevelopment()) {
    baseAtom.debugPrivate = true;
  }

  const broadcastAtom = atomWithBroadcast<TValue>(key, serialized);
  if (isDevelopment()) {
    broadcastAtom.debugPrivate = true;
  }

  const returnedAtom = atom<TValue, [SetStateAction<TValue>], void>(
    (get: Getter) => deserialize(get(baseAtom)),
    (get: Getter, set: Setter, update: SetStateAction<TValue>) => {
      let nextValue!: TValue;
      if (isFunction(update)) {
        nextValue = update(get(baseAtom)) as TValue;
      } else {
        nextValue = update as TValue;
      }

      const nextSerialized = serialize<TValue>(nextValue);

      set(baseAtom, nextSerialized);
      set(broadcastAtom, nextSerialized);
    }
  );
  if (isDevelopment()) {
    returnedAtom.debugPrivate = true;
  }

  return returnedAtom;
}
