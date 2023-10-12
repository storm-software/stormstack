/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from "jotai";

const IS_SERVER =
  typeof window === typeof undefined ||
  typeof BroadcastChannel === typeof undefined;

/*export function atomWithBroadcast<TValue>(
  key: string,
  initialValueOrBaseAtom:
    | TValue
    | WritableAtom<TValue, [SetStateAction<TValue>], void>
): WritableAtom<TValue, [SetStateAction<TValue>], void> {
  const baseAtom = isAtom(initialValueOrBaseAtom)
    ? initialValueOrBaseAtom
    : atom<TValue>(initialValueOrBaseAtom);
  if (isDevelopment()) {
    baseAtom.debugPrivate = true;
  }

  const listeners = new Set<(event: MessageEvent<any>) => void>();

  let channel: any;
  if (!IS_SERVER) {
    channel = IS_SERVER ? new BroadcastChannel(key) : null;
    if (channel) {
      channel.onmessage = (event: MessageEvent<any>) => {
        listeners.forEach(listener => listener(event));
      };
    }
  }

  const broadcastAtom = atom<
    TValue,
    [SetStateAction<{ isEvent: boolean; value: TValue }>],
    void
  >(
    get => get(baseAtom),
    (get, set, update: { isEvent: boolean; value: TValue }) => {
      set(baseAtom, update.value);

      if (!IS_SERVER) {
        if (!update.isEvent && channel) {
          channel.postMessage(JSON.stringify(get(baseAtom)));
        }
      }
    }
  );
  if (isDevelopment()) {
    broadcastAtom.debugPrivate = true;
  }

  broadcastAtom.onMount = setAtom => {
    const listener = (event: MessageEvent<any>) => {
      setAtom({ isEvent: true, value: JSON.parse(event.data) as TValue });
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const returnedAtom = atom<TValue, [SetStateAction<TValue>], void>(
    get => get(broadcastAtom),
    (_, set, update: TValue) => {
      set(broadcastAtom, { isEvent: false, value: update });
    }
  );
  if (isDevelopment()) {
    returnedAtom.debugPrivate = true;
  }

  return returnedAtom;
}*/

export function atomWithBroadcast<TValue>(key: string, initialValue: TValue) {
  const baseAtom = atom(initialValue);
  const listeners = new Set<(event: MessageEvent<any>) => void>();

  const channel = !IS_SERVER ? new BroadcastChannel(key) : null;
  if (channel) {
    channel.onmessage = event => {
      listeners.forEach(listener => listener(event));
    };
  }

  const broadcastAtom = atom<
    TValue,
    [{ isEvent: boolean; value: TValue }],
    void
  >(
    get => get(baseAtom),
    (get, set, update: { isEvent: boolean; value: TValue }) => {
      set(baseAtom, update.value);

      if (!update.isEvent && !IS_SERVER && channel) {
        channel.postMessage(JSON.stringify(get(baseAtom)));
      }
    }
  );
  broadcastAtom.onMount = setAtom => {
    const listener = (event: MessageEvent<any>) => {
      setAtom({ isEvent: true, value: JSON.parse(event.data) });
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const returnedAtom = atom<TValue, [TValue], void>(
    get => get(broadcastAtom),
    (get, set, update: TValue) => {
      set(broadcastAtom, { isEvent: false, value: update });
    }
  );

  return returnedAtom;
}
