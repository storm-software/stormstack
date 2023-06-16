import { IsServer } from "@open-system/core-utilities";
import { atom } from "jotai";
import { atomWithWebStorage } from "../utilities/atomWithWebStorage";

const onlineEvents = ["online", "offline"] as const;

const listeners = new Set<(event: any) => void>();
export const focusListenersAtom = atom(listeners);

export const isFocusAtom = atomWithWebStorage<boolean>("focused", true);
isFocusAtom.onMount = (setAtom: (next: boolean) => void) => {
  // addEventListener does not exist in React Native, but window does
  if (!IsServer && window.addEventListener) {
    const listener = (event: any) => {
      if (typeof event === 'boolean') {
         setAtom(event);
      } else {

      if (
        typeof navigator === "undefined" ||
        typeof navigator.onLine === "undefined"
      ) {
        setAtom(true);
      } else {
        setAtom(navigator.onLine);
      }
    }
    };

    listeners.add(listener);
    const handleListen = (event: any) => listeners.forEach(l => l(event));

    // Listen to online
    onlineEvents.forEach(event => {
      window.addEventListener(event, handleListen, false);
    });

    return () => {
      // Be sure to unsubscribe if a new handler is set
      onlineEvents.forEach(event => {
        window.removeEventListener(event, handleListen);
      });
    };
  }
};
