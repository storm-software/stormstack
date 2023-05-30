/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDevelopment } from "@open-system/core-utilities";
import { WritableAtom, atom } from "jotai";
import { SetStateActionWithReset } from "../types";
import { isAtom } from "../utilities/type-checks";

export function atomWithBroadcast<TValue>(
  key: string,
  initialValueOrBaseAtom:
    | TValue
    | WritableAtom<TValue, [SetStateActionWithReset<TValue>], void>
) {
  const baseAtom = isAtom(initialValueOrBaseAtom)
    ? initialValueOrBaseAtom
    : atom<TValue>(initialValueOrBaseAtom);
  if (isDevelopment()) {
    baseAtom.debugPrivate = true;
  }

  const listeners = new Set<(event: MessageEvent<any>) => void>();
  const channel = new BroadcastChannel(key);
  channel.onmessage = event => {
    listeners.forEach(listener => listener(event));
  };

  const broadcastAtom = atom<
    TValue,
    [{ isEvent: boolean; value: TValue }],
    void
  >(
    get => ObjectSerializer.parse(get(baseAtom), HttpMediaTypes.JSON),
    (get, set, update: { isEvent: boolean; value: TValue }) => {
      set(baseAtom, ObjectSerializer.stringify(update.value, HttpMediaTypes.JSON));

      if (!update.isEvent) {
        channel.postMessage(get(baseAtom));
      }
    }
  );
  if (isDevelopment()) {
    broadcastAtom.debugPrivate = true;
  }

  broadcastAtom.onMount = setAtom => {
    const listener = (event: MessageEvent<any>) => {
      setAtom({ isEvent: true, value: event.data });
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const returnedAtom = atom<TValue, [TValue], void>(
    get => get(broadcastAtom),
    (_, set, update: TValue) => {
      set(broadcastAtom, { isEvent: false, value: update });
    }
  );
  if (isDevelopment()) {
    returnedAtom.debugPrivate = true;
  }

  return returnedAtom;
}
