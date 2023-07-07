import { DateTime, isDevelopment } from "@open-system/core-shared-utilities";
import { atom } from "jotai";

export const atomWithDateTime = (initialValue = DateTime.current) => {
  const returnedAtom = atom(initialValue);
  if (isDevelopment()) {
    returnedAtom.debugPrivate = true;
  }

  return returnedAtom;
};
