import { isDevelopment } from "@stormstack/core-shared-utilities";
import { atom } from "jotai";
import { atomWithToggle } from "../utilities/atomWithToggle";

export const isDarkModeAtom = atom(true); // atomWithWebStorage<boolean>("dark", true);
if (isDevelopment()) {
  isDarkModeAtom.debugPrivate = true;
}

export const toggleDarkModeAtom = atomWithToggle(isDarkModeAtom);
if (isDevelopment()) {
  toggleDarkModeAtom.debugPrivate = true;
}

export const themeAtom = atom("impact"); // atomWithWebStorage<string>("theme", "impact");
if (isDevelopment()) {
  themeAtom.debugPrivate = true;
}
