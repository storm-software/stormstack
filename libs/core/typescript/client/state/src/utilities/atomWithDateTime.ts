import { DateTime, isDevelopment } from "@stormstack/core-shared-utilities";
import { atom } from "jotai";

export const atomWithDateTime = (initialValue = DateTime.current) => {
  const returnedAtom = atom(initialValue);
  if (isDevelopment()) {
    returnedAtom.debugPrivate = true;
  }

  return returnedAtom;
};
