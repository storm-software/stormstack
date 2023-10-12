/* eslint-disable @typescript-eslint/no-explicit-any */
import { Atom } from "jotai";

/**
 * Check if the provided value's type is an atom
 * @param obj - The value to type check
 * @returns An indicator specifying if the object provided is of type an atom
 */
export const isAtom = (maybeAtom: any): maybeAtom is Atom<any> => {
  return (
    maybeAtom !== null &&
    maybeAtom !== undefined &&
    typeof maybeAtom === "object" &&
    (typeof maybeAtom.read === "function" ||
      typeof maybeAtom.write === "function")
  );
};
